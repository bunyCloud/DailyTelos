/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useContext, useState, forwardRef } from "react";
import { AppContext } from "../../AppContext";
import {
  useToast,
  Input,
  Button,
  VStack,
  FormLabel,
  Center,
  Text,
  Box,
  Image,
  HStack,
  Spinner,
  Heading,
  Link,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import { ethers } from "ethers";
import { Form } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { formatAddress } from "../../utils/formatMetamask";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const AddMembersForm = () => {
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState(null);
  const { displayCalendar, calendarName } = useContext(AppContext);
  const [transactionHash, setTransactionHash] = useState(null);
  const addRecentTransaction = useAddRecentTransaction();
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isReview, setIsReview] = useState(false);

  const handleFetchButtonClick = () => {
    setFetchTrigger(!fetchTrigger);
    console.log("updating events...");
  };

  const handleReviewEvent = () => {
    setIsReview(true);
    console.log("Review event data...");
  };

  const [multipleMemberAddresses, setMultipleMemberAddresses] = useState("");

  const renderMemberAddresses = () => {
    // Split the multipleMemberAddresses by commas to get an array
    const addresses = multipleMemberAddresses.split(",").map((address) => address.trim());
    return (
      <List spacing={3}>
        {addresses.map((address, index) => (
          <ListItem key={index}>
            <ListIcon as={ExternalLinkIcon} color="green.500" />
            {address}
          </ListItem>
        ))}
      </List>
    );
  };

  const addMembers = async (addresses) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        displayCalendar,
        CalendarDailyTelos.abi,
        signer,
      );
      const members = addresses.split(",").map((addr) => addr.trim());
      const transaction = await contract.addMembers(members);
      toast({
        title: "Members Added",
        description: "Successfully added members.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      addRecentTransaction({
        hash: transaction.hash,
        description: "Event Created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add members.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {!transactionHash ? (
        <>
          {isLoading ? (
            <Center p={3} w="100%" h="100%">
              <VStack w="100%">
                <Spinner size={"lg"} color="dodgerblue" />
                <Text fontSize="12px" color="black">
                  Please wait...{" "}
                </Text>
                <Text fontSize="12px" color="black">
                  Adding new members...{" "}
                </Text>
              </VStack>
            </Center>
          ) : (
            <>
              {!isReview ? (
                <>
                  <Center>
                    <Form
                      aria-label="create event form"
                      style={{ padding: "4px", marginTop: "2px" }}
                    >
                      <Box width="100%" p={2}>
                        <FormLabel mb={1} mt={1}>
                          Add Members
                        </FormLabel>
                        <Text>Input addresses separated by a comma. </Text>
                        <Input
                          id="multiple-member-addresses"
                          placeholder="Comma-separated Member Addresses"
                          onChange={(e) =>
                            setMultipleMemberAddresses(e.target.value)
                          }
                        />
                      </Box>

                      {multipleMemberAddresses && (
                        <>
                          <Button
                            variant={"solid"}
                            colorScheme="messenger"
                            size="sm"
                            style={{
                              width: "100%",
                              marginTop: "2px",
                              textAlign: "center",
                            }}
                            onClick={handleReviewEvent}
                          >
                            Next
                          </Button>
                        </>
                      )}
                    </Form>
                  </Center>
                </>
              ) : (
                <>
                
                  <VStack w="100%" textAlign="left">
                    <Heading size="sm">Review Members</Heading>
                    <Box minHeight={200} p={2}>
                      {renderMemberAddresses()}
                    </Box>
                    <Button
                      variant={"solid"}
                      colorScheme="messenger"
                      size="sm"
                      style={{
                        width: "100%",
                        marginTop: "2px",
                        textAlign: "center",
                      }}
                      onClick={() => addMembers(multipleMemberAddresses)}
                    >
                      Add Members
                    </Button>
                  </VStack>
                
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Heading size="sm">Members Successfully Added!</Heading>
          <HStack mt={1} mb={1}>
            <Text noOfLines={2}>{formatAddress(transactionHash)}</Text>
            <Link
              href={`https://testnet.teloscan.io/tx/${transactionHash}`}
              isExternal
            >
              View Transaction
              <ExternalLinkIcon mx="2px" />
            </Link>
          </HStack>
        </>
      )}
    </>
  );
};

export default AddMembersForm;

