import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import CalendarDailyTelos from "../contracts/CalendarDailyTelos.json";
import { AppContext } from "../AppContext";

function WhatAllEvents(props) {
    const {events, setEvents} = useContext(AppContext);
  const { account, displayCalendar, rpcUrl, logged } = useContext(AppContext);


  
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

  useEffect(() => {
    const fetchAllEvents = async () => {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(
        displayCalendar,
        CalendarDailyTelos.abi,
        provider,
      );
      const allUsersEvents = await contract.getAllEvents();

      const formattedEvents = allUsersEvents.map((event) => {
        return {
          eventId: event[0].toString(),
          title: event[1],
          description: event[2],
          organizer: event[3],
          metadataURI: event[7],
          start: formatTimestamp(event[4].toNumber()),
          end: formatTimestamp(event[5].toNumber()),
        };
      });

      setEvents(formattedEvents);
      if (props.onEventsFetched) {
        props.onEventsFetched(formattedEvents); // passing events back to parent
      }
    };

    if (props.triggerFetch) {
        fetchAllEvents();
    }
  }, [ props.triggerFetch]);

  // Render component UI (if any) here or return null if this component doesn't render anything
  return null;
}

export default WhatAllEvents;
