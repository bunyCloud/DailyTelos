import React, { useContext, useEffect, useState } from 'react';
import { Box,Button, Center, HStack, IconButton, Link, List, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { ethers } from 'ethers';
import CalendarFactory from '../../contracts/CalendarFactory.json'
import { formatAddress } from '../../utils/formatMetamask'
import { AppContext } from '../../AppContext';
import Button10 from '../Buttons/Button10';
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';

function GetUserCalendars({fetchAllEvents}) {
  const [calendars, setCalendars] = useState([]);
  

  const { displayCalendar, setDisplayCalendar, account, rpcUrl } = useContext(AppContext);
  const [selectedCalendar, setSelectedCalendar] = useState(displayCalendar);
  const contractAddress = CalendarFactory.address;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const listContainerStyle = {
    height: "auto",
    maxHeight: "210px",
    overflowY: "auto",
    marginTop: "8px",
    borderTop: "1px solid ThreeDFace",
    fontSize: "12px",
    color: "black",
    backgroundColor: "white",
  };

 

  const handleCalendarSelect = (calendarAddress) => {
    setSelectedCalendar(calendarAddress);
    setDisplayCalendar(calendarAddress);
    if(calendarAddress){
      fetchAllEvents();
      console.log('Refreshing Events...');
    }
  };

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractAddress, CalendarFactory.abi, provider);

    const fetchCalendars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await contract.getCalendarsByUser(account);
        console.log("Raw response from getCalendarsByUser:", response);
    
        if (!response || !Array.isArray(response)) {
          console.error("Unexpected response structure:", response);
          setError("Unexpected response structure");
          setIsLoading(false);
          return;
        }
    
        // Assuming each item in response is a tuple like: [address, timestamp, anotherAddress, name]
        setCalendars(response.map(tuple => ({
          address: tuple[0],
          timestamp: tuple[1], // You may need to format or use this timestamp
          anotherAddress: tuple[2], // Use this as needed
          name: tuple[3]
        })));
      } catch (error) {
        console.error('Error fetching user calendars:', error);
        setError('Error fetching user calendars');
      }
      setIsLoading(false);
    };
    

    if (account && rpcUrl) {
      fetchCalendars();
    }
  }, [account, rpcUrl]);

  
/**
    const getCalendars = async () => {
    try {
      
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(CalendarFactory.address, CalendarFactory.abi, provider);
      const calendarAddresses = await contract.getCalendars();

      const calendarsData = await Promise.all(
        calendarAddresses.map(async (address) => {
          const calendarInfo = await contract.calendarInfo(address);
          return {
            address: calendarInfo.calendarAddress,
            name: calendarInfo.calendarName,
          };
        }),
      );

      setCalendars(calendarsData);
    } catch (error) {
      console.error('Error getting calendars:', error);
    }
  };

  useEffect(() => {
    getCalendars();
  }, [displayCalendar]);
   */

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <Box style={listContainerStyle}>
    {calendars.length === 0 ? (
      <Text as="b">No calendars found for this user.</Text>
    ) : (
      <>
        <Box>
          <Text as="b" overflow={"hidden"}>
            My deployment(s) {calendars.length} 
          </Text>
          <List spacing={2}>
            {calendars.map((calendar, index) => (
              <React.Fragment key={index}>
                
                  <HStack
                    spacing={2}
                    alignItems="center"
                    justify="space-between"
                  >
                    <Button10
                      onClick={() => handleCalendarSelect(calendar.address)}
                      isSelected={selectedCalendar === calendar.address}
                      width="100%"
                    >
                      
                        <Text as="b" overflow={"hidden"} w='100%'>
                          {calendar.name}
                        </Text>
              
                      
                    </Button10>

                    <Link href={`./${calendar.address}`} isExternal>
                      <IconButton
                        borderRadius={4}
                        border="1px solid blue"
                        bg="white"
                        size="xs"
                        aria-label="External"
                        icon={<ExternalLinkIcon />}
                      />
                    </Link>

                    <IconButton
                      borderRadius={4}
                      border="1px solid blue"
                      bg="white"
                      size="xs"
                      onClick={fetchAllEvents}
                      aria-label="Refresh"
                      icon={<RepeatIcon />}
                    />
                  </HStack>
                
              </React.Fragment>
            ))}
          </List>
        </Box>
      </>
    )}
  </Box>
);
}

export default GetUserCalendars;
