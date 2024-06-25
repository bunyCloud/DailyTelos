import { Card } from "antd";
import { Button, HStack, Link,useToast, VStack, Input, IconButton, Center, Text, FormLabel } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import CalendarFactory from "../../contracts/CalendarFactory.json";
import { ethers } from "ethers";
import { AppContext } from "../../AppContext";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { RepeatIcon } from "@chakra-ui/icons";

const CreateCalendarForm2 = () => {
  const toast = useToast();
  const { account, setDisplayCalendar } = useContext(AppContext);
  const [inputName, setInputName] = useState("");
  const [current, setCurrent] = useState(0);
  const [deployLog, setDeployLog] = useState(null);
  const addRecentTransaction = useAddRecentTransaction()
  

  const next = () => {
    setCurrent(current + 1);
  };

  const handleCalendarName = (name) => {
    setInputName(name);
  };

  const handleDisplayCalendar = (address) => {
    setDisplayCalendar(address);
    console.log("Changing active calendar");
  };
  const [calendarSender, setCalendarSender] = useState(null);
  const [calendarName, setCalendarName] = useState(null);
  const [calendarAddress, setCalendarAddress] = useState(null);

  const resetForm = () => {
    setCurrent(0);
    setInputName("");
    // Reset other states as needed
  };


  const createCalendar = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = CalendarFactory.address;
      const contractABI = CalendarFactory.abi;
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // Event listener setup
      const calendarCreatedListener = (calendarSender, calendarAddress, calendarName, event) => {
        console.log("Calendar Created:", {
          calendarSender,
          calendarAddress,
          calendarName,
        });
        setCalendarSender(calendarSender);
        setCalendarAddress(calendarAddress);
        setCalendarName(calendarName);
        handleDisplayCalendar(calendarAddress);
        console.log("Event details:", event);
  
        // Unsubscribe from event after processing
        contract.off("CalendarCreated", calendarCreatedListener);
      };
  
      contract.on("CalendarCreated", calendarCreatedListener);
  
      const transaction = await contract.createTelosCalendar(inputName);
      const receipt = await transaction.wait(); // Wait for the transaction to be mined
  
      if (receipt.status !== 1) {
        console.error("Transaction failed");
        return;
      }
  
      console.log("Transaction receipt:", receipt);
  
      // Additional processing if needed
  
      const deployLogLink = `https://testnet.teloscan.io/tx/${transaction.hash}`;
      setDeployLog(deployLogLink);
      console.log(deployLogLink);
  
      toast({
        title: "Transaction Successful",
        //description: `${calendarName} was created successfully.`,
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
          <Text p={2}>Input a community name and press 'Enter' to continue.</Text>
        <HStack gap='auto'>
        <FormLabel mt={1}>
                          Name
                        </FormLabel>
            <Center w='100%'>
            <VStack gap="auto"  justify='center' w='100%'>
            
              <Input
                size={"sm"}
                aria-label="Create"
                onKeyDown={handleInputKeyPress}
                // border="1px solid silver"
                w='100%'
                placeholder="Enter a Name"
                value={inputName}
                onChange={(e) => handleCalendarName(e.target.value)}
              />

              
            </VStack>
            </Center>
        </HStack>
        <Button
                onKeyDown={handleInputKeyPress}
                //style={{ width: "100px" }}
                w='100%'
                mt={1}
                borderRadius={0}
                size="sm"
                colorScheme="messenger"
                variant={'solid'}
                onClick={createCalendar}
              >
                Create
              </Button>
          
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
              style={{border:'0px solid white', borderRadius: "0px" }}
              bodyStyle={{
                padding: "4px",
                
                borderRadius: "0px",
                //width: "250px",
              }}
              headStyle={{ fontSize: "12px" }}
            >
              <>{steps[current].content && <>{steps[current].content}</>}</>
            </Card>
          </div>


    </>
  );
};

export default CreateCalendarForm2;
