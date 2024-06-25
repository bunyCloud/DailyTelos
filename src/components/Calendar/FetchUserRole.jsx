import React, { useEffect, useContext } from "react";
import { ethers } from "ethers";
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import {
  Badge,
  Box,
  Center,
  HStack,
  Heading,
  StackDivider,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { AppContext } from "../../AppContext";
import { formatAddress } from "../../utils/formatMetamask";
import CreateCalendarForm from "../Forms/CreateCalendarForm";
import AdminMenu from "../Menu/AdminMenu";

export default function FetchUserRole() {
  const {
    account,
    isMember,
    displayCalendar,
    rpcUrl,
    isGuest,
    calendarName,
    setGuestRole,
    setMemberRole,
    setAdminRole,
    isAdmin,
  } = useContext(AppContext);

  const guestRole =
    "0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f";
  const memberRole =
    "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636";
  const adminRole =
    "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";

  useEffect(() => {
    const fetchUserRole = async () => {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(
        displayCalendar,
        CalendarDailyTelos.abi,
        provider,
      );
      const guest = await contract.hasRole(guestRole, account);
      if (guest) {
        setGuestRole(guest);
      }
      const member = await contract.hasRole(memberRole, account);
      if (member) {
        setMemberRole(member);
      }
      const admin = await contract.hasRole(adminRole, account);
      if (admin) {
        setAdminRole(admin);
      }
      console.log("checking user role...");
    };

    fetchUserRole();
  }, [displayCalendar, account]);

  return (
    <Box>
      <Box p={1} >
        {calendarName && (<><Heading  size="sm" color='blue'>Selected: {calendarName}</Heading></>)}
        <Box w="100%">
        <HStack w='100%' gap={'auto'}>
          <HStack gap={'2px'}>
            <Text as="b" textAlign="left">
              Connected:{" "}
            </Text>
            <Text>{formatAddress(account)}</Text>
          </HStack>

          {!isAdmin && !isGuest && !isMember ? (
            <>
              <Badge colorScheme="orange">No Role</Badge>
            </>
          ) : (
            <>
              <HStack gap={'2px'}>
                <Text as="b" textAlign="left">
                  Role:
                </Text>
                <Wrap>
                  <WrapItem>
                    {isAdmin && (
                      <>
                        <Badge colorScheme="green">Admin</Badge>
                      </>
                    )}
                    {isMember && (
                      <>
                        <Badge colorScheme="green">Member</Badge>
                      </>
                    )}

                    {isGuest && !isMember && (
                      <>
                        <Badge colorScheme="orange">Guest</Badge>
                      </>
                    )}
                  </WrapItem>
                </Wrap>
              </HStack>
            </>
          )}
          </HStack>
        </Box>
      </Box>

      <VStack divider={<StackDivider />} spacing={1} align="stretch">
        <Box h="auto" >
          {!isAdmin && !isGuest && !isMember && (
            <>
              <Box>
                <Center>
                  <VStack>
                    <Text w="auto">Join a community or create one</Text>
                    <CreateCalendarForm />
                  </VStack>
                </Center>
              </Box>
            </>
          )}
        </Box>

        <Box h="auto" >
          {isAdmin && (
            <>
              <AdminMenu />
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
}