/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { Heading, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import CreateCalendarForm2 from "../Forms/CreateCalendarForm";

const CreateCalendarModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button  size="sm" onClick={onOpen}>
        Create Community
      </Button>

      <Modal
        style={{ zIndex: "9999" }}
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
        <Heading size='sm'>Create Community</Heading>
          <ModalBody style={{ zIndex: 9999 }}>
          <CreateCalendarForm2 />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCalendarModal;
