/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {  } from "react";
import {
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import CreateEventForm from "../Forms/CreateEventForm";

const CreateEventModal = () => {
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  
  
/*

  const handleValidate = async () => {
    let errors = [];

    // Check title
    if (!title.trim()) {
      errors.push("Event title is required.");
    }

    // Check description
    if (!description.trim()) {
      errors.push("Event description is required.");
    }

    // Check start and end time
    if (!startTime || !endTime) {
      errors.push("Start and end times are required.");
    } else if (endTime <= startTime) {
      errors.push("End time should be after start time.");
    }

    // Check invitees
    const inviteesArray = invitees.split(",").map((item) => item.trim());
    if (inviteesArray.length === 0) {
      errors.push("At least one invitee is required.");
    } else {
      inviteesArray.forEach((invitee) => {
        if (!/^0x[a-fA-F0-9]{40}$/.test(invitee)) {
          errors.push(`${invitee} is not a valid Ethereum address.`);
        }
      });
    }

    // Check image upload
    if (!imageUrl) {
      errors.push("Image is required.");
    }

    // If there are any errors, show a toast and exit
    if (errors.length > 0) {
      /*
          toast({
              id: 'validation-errors',
              title: 'Validation Errors',
              description: errors.join('\n'),
              status: 'error',
              duration: 5000,
              isClosable: true,
          });
          

      console.log("form inputs missing");
      return;
    }

    // If no errors, proceed with creating the event
    await handleCreateEvent();
  };
  */

 

  return (
    <>
<Button  size='sm' onClick={onOpen}>Create Event</Button>

<Modal style={{zIndex:'9999'}} isOpen={isOpen} onClose={onClose} size='sm'>
        <ModalOverlay />
        <ModalContent>
          
          <ModalBody style={{zIndex:9999}}>
            <CreateEventForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateEventModal;
