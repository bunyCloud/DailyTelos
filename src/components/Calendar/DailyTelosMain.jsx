import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Avatar,
} from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import EventDisplayModal from "../Modals/EventDisplayModal";
import CreateEventForm from "../Forms/CreateEventForm";
import WhatAllEvents from "../../hooks/WhatAllEvents";

const localizer = momentLocalizer(moment);

const DailyTelosMain = ({events }) => {
  //const { events, setEvents } = useContext(AppContext);
  const { displayCalendar } = useContext(AppContext);
  const {
    isOpen: isOpenSlotModal,
    onOpen: onOpenSlotModal,
    onClose: onCloseSlotModal,
  } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const [fetchTrigger, setFetchTrigger] = useState(false);

  const handleFetchButtonClick = () => {
    setFetchTrigger(!fetchTrigger);
    console.log("updating events...");
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsVisible(true);
  };

  const handleClosePopup = () => {
    setIsVisible(false);
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    onOpenSlotModal();
  };

  
  useEffect(() => {
    if(displayCalendar){
       handleFetchButtonClick();
    console.log('Updating Events...');
     }
   
     }, [displayCalendar]);
   



  const EventWrapper = ({ event, children }) => {
    const imageSrc = event.metadataURI || "/telos.png"; // Provide a default image source if metadataURI is not available

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
      <Avatar src={imageSrc} alt="Event" size="xs" marginRight="1px" border='1px solid #0700dd' />
      {children}
    </div>
    );
  };

  return (
    <div >
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        popup={true}
        events={events}
        style={{ height: "90vh", width: "100%", backgroundColor:'white', color:'black', border:'1p solid silver', borderRadius:'6px', marginTop:'2px', marginBottom:'8px' }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        eventPropGetter={() => {
          const backgroundColor = "#dbe9ee";
          const color = "black";
          const border = "1px solid #0700dd";
          return { style: { backgroundColor, color, border } };
        }}
        components={{
          eventWrapper: EventWrapper,
        }}
        views={['month', 'agenda']} 

      />

      <Modal isOpen={isOpenSlotModal} onClose={onCloseSlotModal} size={"sm"}>
        <ModalOverlay />
        <ModalContent bg='ghostwhite'>
          <ModalCloseButton />
          <ModalBody>
            <CreateEventForm />
          </ModalBody>
        </ModalContent>
      </Modal>

      <EventDisplayModal
        calendarAddress={displayCalendar}
        selectedEvent={selectedEvent}
        isVisible={isVisible}
        onClose={handleClosePopup}
      />
      <WhatAllEvents triggerFetch={fetchTrigger} />
    </div>
  );
};

export default DailyTelosMain;
