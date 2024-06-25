import React, { useState, useContext, useEffect } from "react";
import {
  Center,
  Text,
  VStack,
  Wrap,
  WrapItem,
  IconButton,
  Image,
  HStack,
  Container,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import { Space } from "antd";
import { AppContext } from "../../AppContext";
import { BackwardOutlined, ForwardOutlined } from "@ant-design/icons";



const contentStyle = {
  textAlign: "center",
  width: "100%",

  borderTop: "0.5px solid silver",
  //borderBottom: '0.5px solid silver',
  //minHeight: '250px',
  //marginBottom: '15px',
  //color: 'white',
  //backgroundColor: 'white',
//  color: "black",
};

const FetchAllEvents = () => {
  const { displayCalendar, rpcUrl } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };

  async function fetchAllEvents() {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
      displayCalendar,
      CalendarDailyTelos.abi,
      provider,
    );
    setIsLoading(true);
    console.log("loading events....");
    const all = await contract.getAllEvents();
    console.log(all);
    setIsLoading(false);
    console.log("done loading events....");
    return all;
  }

  useEffect(() => {
    fetchAllEvents().then((events) => setEvents(events));
  }, [displayCalendar]);

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const handlePreviousEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length,
    );
  };

  const currentEvent = events[currentEventIndex];

  return (
    <Space direction="vertical" style={contentStyle}>
      
        <VStack spacing={2} w="100%">
          {isLoading && (
            <>
              <Text mt={2} >
                Loading Events....
              </Text>
            </>
          )}
          {!isLoading && !currentEvent && (
            <Text  mt={2}>
              No events found...
            </Text>
          )}
          {currentEvent && !isLoading && (
            <Wrap spacing={1} justify="center" align="center" >
              <WrapItem key={currentEventIndex} w="100%">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <VStack gap='auto' w='100%' justify='center'>
                    <Text as="b" fontSize={"16px"}>
                      {currentEvent.title}
                    </Text>
                    <HStack>
                    <Text as='b'>Starts:</Text>
                    <Text  fontSize={"12px"}>
                      {formatTimestamp(currentEvent.startTime)}
                    </Text>
                    </HStack>


                    <HStack>
                    <Text as='b' pr={1}>Ends:</Text>
                    <Text  fontSize={"12px"}>
                      {formatTimestamp(currentEvent.endTime)}
                    </Text>
                    </HStack>

                    <HStack w='100%'  mb={-1} justify='center'>
                      <IconButton
                        //size="sm"
                        variant={"unstyled"}
                        aria-label="Previous Event"
                        icon={<BackwardOutlined />}
                        onClick={handlePreviousEvent}
                        isDisabled={events.length <= 1}
                      />
                      <Image
                      mt={-1}
                        src={currentEvent.metadataURI}
                        objectFit="cover"
                        width="180px"
                        height="180px"
                      />
      
                      <IconButton
                        variant={"unstyled"}
                        //size={"sm"}
                        aria-label="Next Event"
                        icon={<ForwardOutlined />}
                        onClick={handleNextEvent}
                        isDisabled={events.length <= 1}
                      />
                    </HStack>

                    <Container overflow={'hidden'}>
                        <Text overflow={'hidden'} w='300px' noOfLines={2}>
                        {currentEvent.description}
                        </Text>
                      </Container>
                  </VStack>
                </div>
              </WrapItem>
            </Wrap>
          )}

          
        </VStack>
      
    </Space>
  );
};

export default FetchAllEvents;
