import React, { useContext, useEffect, useState } from 'react';
import { Box,Button, Center, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { ethers } from 'ethers';
import CalendarFactory from '../../contracts/CalendarFactory.json'
import { formatAddress } from '../../utils/formatMetamask'
import { AppContext } from '../../AppContext';
import Button10 from '../Buttons/Button10';

function GetUserCalendars({fetchAllEvents}) {
  const [calendars, setCalendars] = useState([]);
  

  const { displayCalendar, setDisplayCalendar, account, rpcUrl } = useContext(AppContext);
  const [selectedCalendar, setSelectedCalendar] = useState(displayCalendar);
  const contractAddress = CalendarFactory.address;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 

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
    <Box>
      {calendars.length === 0 ? (
        <Text as='b'>No calendars found for this user.</Text>
      ) : (
        <>
        <Center>
        <Text as='b' overflow={'hidden'}  > {calendars.length} deployment(s)</Text>
        </Center>
          <ul>
            {calendars.map((calendar, index) => (
              <li key={index}>
                <Wrap  w='auto'  overflow={'auto'} >
                  <WrapItem justify='center' w='100%'>
                    
                      <VStack w='100%' justify='center'>
                      
                      <HStack gap='auto'  w='100%' justify='center'>
                      
                      <Button10 
                        
                        onClick={() => handleCalendarSelect(calendar.address)}
  isSelected={selectedCalendar === calendar.address}
                        
                        width='100%'
                        
                        >
                          <HStack>
                          <Text as='b' overflow={'hidden'}  >{calendar.name}</Text>
                          <Text w={'auto'}  overflow={'hidden'} noOfLines={1}>{formatAddress(calendar.address)}</Text>
                          </HStack>
                        </Button10>
                        
                      </HStack>

                      </VStack>
                      
                  
                  </WrapItem>
                  <WrapItem>
                </WrapItem>
              </Wrap>
            </li>
          ))}
        </ul>
      </>
    )}
  </Box>
);
}

export default GetUserCalendars;
