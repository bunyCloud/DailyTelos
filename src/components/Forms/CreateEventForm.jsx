/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useContext, useState, useEffect, forwardRef } from "react";
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
} from "@chakra-ui/react";
import { create } from "ipfs-http-client";
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import { ethers } from "ethers";
import { Form } from "antd";
import { Buffer } from "buffer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import WhatAllEvents from "../../hooks/WhatAllEvents";
import CopyToClipboardButton from "../../utils/CopyToClipboardButton";
import moment from "moment";
import { formatAddress } from "../../utils/formatMetamask";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const projectId = "2RMVb2CNm5bmXOtwFsrIyAXnNqx";
const projectSecret = "b516ce6e2e07f1828d70cf50df87f859";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const CreateEventForm = () => {
  const [file, setFile] = useState();
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { displayCalendar, calendarName } = useContext(AppContext);
  const [transactionHash, setTransactionHash] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const addRecentTransaction = useAddRecentTransaction();
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isReview, setIsReview] = useState(false);

  const handleFetchButtonClick = () => {
    setFetchTrigger(!fetchTrigger);
    console.log("updating events...");
  };

  const handleReviewEvent = () => {
    setIsReview(true);
    console.log("Review event data...");
  };

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  const handleFileChange = (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    setFile(file);
    toast({
      title: "Image Upload",
      description: `Uploading image to IPFS..`,
      status: "info",
      duration: 1000,
      isClosable: true,
    });
    setIsUploading(false);
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (!file) return;

      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`Upload progress: ${prog}`),
        });
        const imageUrl = `https://ipfs.io/ipfs/${added.path}`;
        setImageUrl(imageUrl);
        console.log("Uploaded image to IPFS:", imageUrl);
        if (isToastOpen) {
          toast.closeAll();
        }
        toast({
          title: "IPFS Upload Confirmed!",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        setIsToastOpen(true);
      } catch (error) {
        console.error("Error uploading image to IPFS:", error);
        setIsToastOpen(false);
      }
    };

    uploadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const guestRole =
    "0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f";
  const memberRole =
    "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636";
  const adminRole =
    "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";

  const getRoleName = (roleAddress) => {
    switch (roleAddress) {
      case memberRole:
        return "Member";
      case guestRole:
        return "Guest";
      case adminRole:
        return "Admin";
      default:
        return "Unknown Role";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date;
  };

  const [eventData, setEventData] = useState({
    eventID: null,
    title: "",
    organizer: "",
    startTime: "",
    endTime: "",
    metadataURI: "",
    timestamp: "",
    role: "",
  });

  // Function to update the state with event data
  function updateEventData(eventData) {
    setEventData({
      eventID: eventData.eventID,
      title: eventData.title,
      description: eventData.description,
      organizer: eventData.organizer,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      metadataURI: eventData.metadataURI,
      timestamp: eventData.timestamp,
      role: eventData.role,
    });
    console.log(title);
  }

  const handleCreateEvent = async () => {
    setIsLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      displayCalendar,
      CalendarDailyTelos.abi,
      signer,
    );
    const startTimestamp = Math.floor(startTime.getTime() / 1000);
    const endTimestamp = Math.floor(endTime.getTime() / 1000);
    let currentToastId;
    const showToast = (options) => {
      if (currentToastId) {
        toast.close(currentToastId);
      }
      currentToastId = toast(options);
    };
    try {
      const transaction = await contract.createEvent(
        title,
        description,
        startTimestamp,
        endTimestamp,
        imageUrl,
      );

      const filter = contract.filters.NewEventCreated(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      );
      const eventLogs = await contract.queryFilter(
        filter,
        transaction.blockNumber,
      );

      if (eventLogs.length > 0) {
        const event = eventLogs[0];
        const eventData = {
          eventID: ethers.BigNumber.from(event.args[0]).toNumber(),
          title: event.args[1],
          //description: event.args[2],
          organizer: event.args[2],
          startTime: formatTimestamp(event.args[3]),
          endTime: formatTimestamp(event.args[4]),
          metadataURI: event.args[5],
          timestamp: formatTimestamp(event.args[6]),
          role: getRoleName(event.args[7]),
        };
        console.log("Event data:", eventData);
        updateEventData(eventData);
        setEventData(eventData);
      }

      showToast({
        id: "transaction-sent",
        title: "Transaction",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      const receipt = await transaction.wait(1);
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      console.log("Transaction confirmed: ", transaction.hash);
      console.log("Transaction sent: ", transaction.hash);
      setTransactionHash(transaction.hash);
      showToast({
        id: "transaction-success",
        title: "Event Created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      addRecentTransaction({
        hash: transaction.hash,
        description: "Event Created",
      });
      handleFetchButtonClick();
    } catch (error) {
      showToast({
        id: "transaction-failure",
        title: "Transaction failed call a supervisor!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("An error occurred:", error);
    }
    setIsLoading(false);
  };

  function formatDate(dateString) {
    return moment(dateString).format("M/D/YYYY h:mm A [CST]");
  }

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
                  Creating new event...{" "}
                </Text>
                <HStack>
                  <Text as="b">Event:</Text>
                  <Text fontSize="12px" color="black">
                    {title}
                  </Text>
                </HStack>

                <Image src={imageUrl} />
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
                      <Box width="100%">
                        <FormLabel mb={-1} mt={1}>
                          Start Time
                        </FormLabel>
                        <DatePicker
                          selected={startTime}
                          onChange={(date) => setStartTime(date)}
                          showTimeSelect
                          dateFormat="Pp"
                          customInput={<CustomInput />}
                        />

                        <FormLabel mb={-1} mt={1}>
                          End Time
                        </FormLabel>
                        <DatePicker
                          selected={endTime}
                          onChange={(date) => setEndTime(date)}
                          showTimeSelect
                          dateFormat="Pp"
                          customInput={<CustomInput />}
                        />

                        <FormLabel mb={-1} mt={1}>
                          Title
                        </FormLabel>
                        <Input
                          size="sm"
                          id="title"
                          w="250px"
                          onChange={(e) => setTitle(e.target.value)}
                          labelText="Event Title"
                          value={title}
                          placeholder="Title of event"
                        />

                        <FormLabel mb={-1} mt={1}>
                          Description
                        </FormLabel>
                        <Input
                          size="sm"
                          w="250px"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          id="description"
                          rows={3}
                          labelText="Event Description"
                          placeholder="Details describing your event."
                        />

                        {isUploading ? (
                          <Center p={12} w="100%" h="100%">
                            <VStack w="100%">
                              <Spinner size={"lg"} color="dodgerblue" />
                              <Text fontSize="12px" color="black">
                                Please wait...{" "}
                              </Text>
                              <Text fontSize="12px" color="black">
                                Uploading image to IPFS...{" "}
                              </Text>
                            </VStack>
                          </Center>
                        ) : (
                          <>
                            {" "}
                            <FormLabel mb={-1} mt={1}>
                              Metadata (IPFS)
                            </FormLabel>
                            <Input
                              size="sm"
                              w="250px"
                              variant="filled"
                              type="file"
                              onChange={handleFileChange}
                            />
                          </>
                        )}
                      </Box>
                      {!imageUrl ? (
                        <>
                          <Text fontSize="10px">
                            *.png *.jpg images accepted
                          </Text>
                        </>
                      ) : (
                        <>
                          {" "}
                          <HStack mt={-1}>
                            <Text
                              bg="#00f2ff"
                              p={1}
                              fontSize="10px"
                              w="225px"
                              overflow="hidden"
                              noOfLines={1}
                            >
                              {imageUrl}
                            </Text>
                            <CopyToClipboardButton value={imageUrl} />
                          </HStack>
                        </>
                      )}

                      {title &&
                        imageUrl &&
                        description &&
                        startTime &&
                        endTime && (
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
                    <Heading size="sm">Review Event</Heading>

                    <HStack w="100%">
                      <Text as="b">Start: </Text>
                      <Text>{formatDate(startTime)}</Text>
                    </HStack>

                    <HStack w="100%">
                      <Text as="b">End: </Text>
                      <Text>{formatDate(endTime)}</Text>
                    </HStack>

                    <HStack w="100%">
                      <Text as="b">Title: </Text>
                      <Text>{title}</Text>
                    </HStack>

                    <HStack w="100%">
                      <Text as="b">Description: </Text>
                      <Text>{description}</Text>
                    </HStack>

                    <Center>
                      <Image src={imageUrl} w="auto" />
                    </Center>

                    <Button
                      variant={"solid"}
                      colorScheme="messenger"
                      size="sm"
                      style={{
                        width: "100%",
                        marginTop: "2px",
                        textAlign: "center",
                      }}
                      onClick={handleCreateEvent}
                    >
                      Create Event
                    </Button>
                  </VStack>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Heading size="sm">Event Successfully Created!</Heading>
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
          {eventData.eventID && (
            <>
              <Text as="b" mb={1} w="100%">
                Event Data
              </Text>

              <HStack>
                <HStack gap="2px">
                  <Text as="b">Id:</Text>
                  <Text w="100%">{eventData.eventID.toString()}</Text>
                </HStack>

                <HStack gap="2px">
                  <Text as="b" w="100%" overflow="hidden">
                    Title:
                  </Text>
                  <Text w="100%">{eventData.title}</Text>
                </HStack>
              </HStack>

              <HStack>
                <HStack gap="2px">
                  <Text as="b">Organizer:</Text>
                  <Text>
                    {eventData.organizer && (
                      <>{formatAddress(eventData.organizer)}</>
                    )}
                  </Text>
                  <CopyToClipboardButton value={eventData.organizer} />
                </HStack>

                <HStack gap="2px">
                  <Text as="b">Role:</Text>
                  <Text w="100%">{eventData.role}</Text>
                </HStack>
              </HStack>

              <HStack>
                <HStack gap="2px">
                  <Text as="b">Start:</Text>
                  <Text w="100%">{formatDate(eventData.startTime)}</Text>
                </HStack>

                <HStack gap="2px">
                  <Text as="b">End:</Text>
                  <Text w="100%">{formatDate(eventData.endTime)}</Text>
                </HStack>
              </HStack>
            </>
          )}
        </>
      )}

      <WhatAllEvents triggerFetch={fetchTrigger} />
    </>
  );
};

export default CreateEventForm;

// Custom Input Component
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <Input
    size="sm"
    width="250px"
    onClick={onClick}
    ref={ref}
    value={value}
    readOnly // Makes the input read-only since the date is picked from the picker
  />
));
