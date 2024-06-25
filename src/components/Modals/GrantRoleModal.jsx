/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";

import AddMembersForm from "../Forms/AddMembersForm";
import GrantRoleForm from "../Forms/GrantRoleForm";

const GrantRoleModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button  size="sm" onClick={onOpen}>
        Grant Role
      </Button>

      <Modal
        style={{ zIndex: "9999" }}
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody style={{ zIndex: 9999 }}>
            <GrantRoleForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GrantRoleModal;
