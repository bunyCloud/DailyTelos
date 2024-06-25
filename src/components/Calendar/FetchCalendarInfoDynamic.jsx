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
} from "@chakra-ui/react";
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import { ethers } from "ethers";
import { NoticeBar } from "antd-mobile";
import { AppContext } from "../../AppContext";
import CopyToClipboardButton from "../../utils/CopyToClipboardButton";


const FetchCalendarInfoDynamic = ({ calendarAddress }) => {
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
          <HStack p={2} bg='whitesmoke'>
            <Text
              fontSize={"12px"}
              w="auto"
              maxWidth="260px"
              overflow="auto"
              noOfLines={1}
              
            >
              {calendarAddress}
            </Text>
            <CopyToClipboardButton value={calendarAddress} />
          </HStack>

          <HStack p={2} bg='whitesmoke'>
          <Text fontSize={'12px'} w='auto' maxWidth='260px' overflow='auto' noOfLines={1} mt={2}>
            {`https://dailytelos.netlify.app/${calendarAddress}`}
          </Text>
            <CopyToClipboardButton value={`https://dailytelos.netlify.app/${calendarAddress}`} />
          </HStack>

          

          <Wrap w="auto" justify={"center"}>
            <WrapItem>
              <NoticeBar
                style={{ width: "150px" }}
                color="default"
                
                content={<>Guest: {guestCount}</>}
              />
            </WrapItem>
            <WrapItem>
              <NoticeBar
                style={{ width: "150px" }}
                color="default"
                
                content={<>Members: {memberCount}</>}
              />
            </WrapItem>
            <WrapItem>
              <NoticeBar
                style={{ width: "150px" }}
                color="default"
                
                content={<>Admins: {adminCount}</>}
              />
            </WrapItem>
            <WrapItem>
              <NoticeBar
                style={{ width: "150px" }}
                color="info"
                
                content={<>Events: {totalEvents}</>}
              />
            </WrapItem>
          </Wrap>
        </VStack>
      </Center>
    </div>
  );
};

export default FetchCalendarInfoDynamic;
