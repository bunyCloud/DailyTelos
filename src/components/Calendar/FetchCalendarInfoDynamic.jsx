import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  HStack,
  Center,
  VStack,
  Wrap,
  WrapItem,
  Heading,
  Icon,
  Box,
} from "@chakra-ui/react";
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import { ethers } from "ethers";
import { NoticeBar } from "antd-mobile";
import { AppContext } from "../../AppContext";
import CopyToClipboardButton from "../../utils/CopyToClipboardButton";


const FetchCalendarInfoDynamic = ({owner, calendarAddress }) => {
  const { rpcUrl } = useContext(AppContext);
  const [adminCount, setAdminCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [calendarName, setCalendarName] = useState(null);

  useEffect(() => {
    async function fetchCalendarName() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(
        calendarAddress,
        CalendarDailyTelos.abi,
        provider,
      );
      const name = await contract.calendarName();
      console.log(`Connecting to calendar ${name}`);
      setCalendarName(name);
    }
    fetchCalendarName();
  }, [calendarAddress]);

  useEffect(() => {
    async function fetchStats() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(
        calendarAddress,
        CalendarDailyTelos.abi,
        provider,
      );
      const ac = await contract.adminCount();
      const gc = await contract.guestCount();
      const mc = await contract.memberCount();
      const te = await contract.totalEvents();
      // Update state variables
      setAdminCount(ac.toString());
      setGuestCount(gc.toString());
      setMemberCount(mc.toString());
      setTotalEvents(te.toString());
    }

    fetchStats();
  }, [calendarAddress]);

  useEffect(() => {
    async function fetchStats() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(
        calendarAddress,
        CalendarDailyTelos.abi,
        provider,
      );
      const te = await contract.totalEvents();
      setTotalEvents(te.toString());
    }
    fetchStats();
  }, [calendarAddress, rpcUrl]);
  return (
    <div>
      <Center>
        <VStack w="100%" maxWidth={400}>
          <HStack>
            <Heading as="h2" noOfLines={1}>
              {calendarName}
            </Heading>
            
          </HStack>
          {/*
          <Box
            height="100%"
            width="100%"
            padding={1}
            borderWidth="1px"
            borderRadius="lg"
            textAlign={"center"}
          >
            <AddGuestDynamic calendarAddress={calendarAddress} />
          </Box>
          */}
          <HStack p={2} bg='whitesmoke' w='100%' justify='center'>
          <Text as='b'>Group:</Text>
            <Text
              fontSize={"12px"}
              w="auto"
              bg='white'
              border='1px solid silver'
              p={1}
              overflow="auto"
              noOfLines={1}
              
            >
            
              {calendarAddress}
            </Text>
            <CopyToClipboardButton value={calendarAddress} />
          </HStack>

          <HStack p={2} bg='whitesmoke' w='100%' justify='center'>
          <Text as='b'>Owner: </Text>
            <Text
              fontSize={"12px"}
              w="auto"
              bg='white'
              border='1px solid silver'
              p={1}
              overflow="auto"
              noOfLines={1}
              
            >
            
              {owner}
            </Text>
            <CopyToClipboardButton value={owner} />
          </HStack>

          <HStack p={2} bg='whitesmoke' w='100%'>
          <Text as='b'>Profile:</Text>
            <Text
              fontSize={"12px"}
              w="auto"
              bg='white'
              border='1px solid silver'
              p={1}
              overflow="auto"
              noOfLines={1}
              maxWidth={270}
              
            >
            {`https://dailytelos.netlify.app/${calendarAddress}`}
          </Text>
            <CopyToClipboardButton value={`https://dailytelos.netlify.app/${calendarAddress}`} />
          </HStack>

          <WrapItem>
              <Box>
              <>Admins: {adminCount}</>
              </Box>
            </WrapItem>

          <Wrap w="auto" justify={"center"}>
            <WrapItem>
              <Box>
              <>Guest: {guestCount}</>
              </Box>
            </WrapItem>
            
            <WrapItem>
              <Box>
              <>Members: {memberCount}</>
              </Box>
            </WrapItem>
            
            
            
            
            
          </Wrap>
          <Box p={2}>
          <>Total Events: {totalEvents}</>
          </Box>
        </VStack>
      </Center>
    </div>
  );
};

export default FetchCalendarInfoDynamic;
