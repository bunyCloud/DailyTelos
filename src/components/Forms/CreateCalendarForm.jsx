import { Card } from "antd";
import {
  Button,
  HStack,
  Link,
  useToast,
  VStack,
  Input,
  IconButton,
  Center,
  Checkbox,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { ethers } from "ethers";
import { AppContext } from "../../AppContext";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { RepeatIcon } from "@chakra-ui/icons";
import Button30 from "../Buttons/Button30";

const CreateCalendarForm = () => {
  const toast = useToast();
  const { setDisplayCalendar, factoryABI, calendarFactoryAddress } = useContext(AppContext);
  const [inputName, setInputName] = useState("");
  const [inputVisibility, setInputVisibility] = useState(true);
  const [current, setCurrent] = useState(0);
  const [deployLog, setDeployLog] = useState(null);
  const addRecentTransaction = useAddRecentTransaction();

  const next = () => {
    setCurrent(current + 1);
  };

  const handleCalendarName = (name) => {
    setInputName(name);
  };

  const handleVisibilityChange = (e) => {
    // When checkbox is checked, visibility is false 
    setInputVisibility(!e.target.checked);
  };

  const handleDisplayCalendar = (address) => {
    setDisplayCalendar(address);
    console.log("Changing active calendar");
  };
  const [calendarSender, setCalendarSender] = useState(null);
  const [calendarName, setCalendarName] = useState(null);
  const [calendarAddress, setCalendarAddress] = useState(null);
  const [visibility, setVisibility] = useState(null);

  const resetForm = () => {
    setCurrent(0);
    setInputName("");

    // Reset other states as needed
  };

  const createCalendar = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = calendarFactoryAddress;
      const contractABI = factoryABI;
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );

      // Event listener setup
      const calendarCreatedListener = (
        calendarSender,
        calendarAddress,
        calendarName,
        visibility,
        event,
      ) => {
        console.log("Calendar Created:", {
          calendarSender,
          calendarAddress,
          calendarName,
          visibility,
        });
        setCalendarSender(calendarSender);
        setCalendarAddress(calendarAddress);
        setCalendarName(calendarName);
        setVisibility(visibility);
        handleDisplayCalendar(calendarAddress);
        console.log("Event details:", event);

        contract.off("CalendarCreated", calendarCreatedListener);
      };

      contract.on("CalendarCreated", calendarCreatedListener);

      const transaction = await contract.createTelosCalendar(
        inputName,
        inputVisibility,
      );
      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        console.error("Transaction failed");
        return;
      }

      console.log("Transaction receipt:", receipt);
      const deployLogLink = `https://testnet.teloscan.io/tx/${transaction.hash}`;
      setDeployLog(deployLogLink);
      console.log(deployLogLink);

      toast({
        title: "Transaction Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      addRecentTransaction({
        hash: transaction.hash,
        description: "Calendar Created",
      });

      if (deployLogLink) {
        next();
      }
    } catch (error) {
      console.error("Error creating calendar:", error);
      toast({
        title: "Transaction Failed",
        description: "An error occurred while creating the calendar.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
      createCalendar();
    }
  };

  const steps = [
    {
      title: "Calendar Name",
      content: (
        <>
          <Center>
            <VStack gap="auto" justify="center" w="100%">
              <Input
                mb={2}
                aria-label="Create"
                onKeyDown={handleInputKeyPress}
                // border="1px solid silver"
                w="auto"
                placeholder="Enter a Name"
                value={inputName}
                onChange={(e) => handleCalendarName(e.target.value)}
              />
 <Checkbox
        isChecked={!inputVisibility} 
        onChange={handleVisibilityChange}
        mb={2}
      >
        Private
      </Checkbox>
              <div
                className="App"
                style={{ textAlign: "center", width: "100%" }}
              >
                <Button30
                  onKeyDown={handleInputKeyPress}
                  onClick={createCalendar}
                >
                  Create Calendar
                </Button30>
              </div>
            </VStack>
          </Center>
        </>
      ),
    },

    {
      title: "Transaction Results",
      content: (
        <>
          <VStack gap="auto">
            {deployLog && (
              <>
                <Link href={deployLog} target="_blank">
                  <Button variant={"link"} size={"xs"} target="_blank">
                    View Transaction
                  </Button>
                </Link>
                <IconButton
                  aria-label="Reset form"
                  icon={<RepeatIcon />}
                  size="sm"
                  onClick={resetForm}
                />
              </>
            )}
          </VStack>
        </>
      ),
    },
  ];

  return (
    <>
      <div>
        <Card
          style={{ border: "0px solid white", borderRadius: "0px" }}
          bodyStyle={{
            padding: "0px",

            borderRadius: "0px",
            width: "auto",
          }}
          headStyle={{ fontSize: "12px" }}
        >
          <>{steps[current].content && <>{steps[current].content}</>}</>
        </Card>
      </div>
    </>
  );
};

export default CreateCalendarForm;
