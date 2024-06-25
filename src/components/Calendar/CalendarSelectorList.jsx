import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import CalendarFactory from "../../contracts/CalendarFactory.json";
import { AppContext } from "../../AppContext";
import {
  useToast,
  List,
  ListItem,
  Box,
  Text,
  Link,
  Button,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";
import Button10 from "../Buttons/Button10";

export default function CalendarSelectorList({ fetchAllEvents }) {
  const { displayCalendar, rpcUrl, setDisplayCalendar } =
    useContext(AppContext);
  const [selectedCalendar, setSelectedCalendar] = useState(displayCalendar);
  const [calendars, setCalendars] = useState([]);
  const toast = useToast();

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
    if (calendarAddress) {
      fetchAllEvents();
      console.log("Refreshing Events...");
    }
  };

  const getCalendars = async () => {
    try {
      toast.closeAll();
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(
        CalendarFactory.address,
        CalendarFactory.abi,
        provider,
      );
      const calendarAddresses = await contract.getCalendars();

      const calendarsData = await Promise.all(
        calendarAddresses.map(async (address) => {
          const calendarInfo = await contract.calendarInfo(address);
          return {
            address: calendarInfo.calendarAddress,
            name: calendarInfo.calendarName,
            public: calendarInfo.visibility,
          };
        }),
      );

      setCalendars(calendarsData);
    } catch (error) {
      console.error("Error getting calendars:", error);
    }
  };

  useEffect(() => {
    getCalendars();
  }, [displayCalendar]);

  return (
    <Box style={listContainerStyle}>
      <List spacing={2}>
        {calendars.map((calendar, index) => (
          <>
            {calendar.public && (
              <>
                <HStack
                  key={index}
                  spacing={2}
                  alignItems="center"
                  justify="space-between"
                >
                  <Button10
                    onClick={() => handleCalendarSelect(calendar.address)}
                    isSelected={selectedCalendar === calendar.address}
                  >
                    {calendar.name}
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
              </>
            )}
          </>
        ))}
      </List>
      <Text>* Select a community to load</Text>
    </Box>
  );
}
