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
  Select,
} from "@chakra-ui/react";
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import { ethers } from "ethers";
import { Form } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { formatAddress } from "../../utils/formatMetamask";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const RevokeRoleForm = () => {
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState(null);
  const { displayCalendar, calendarName } = useContext(AppContext);
  const [transactionHash, setTransactionHash] = useState(null);
  const addRecentTransaction = useAddRecentTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [roleToRevoke, setRoleToRevoke] = useState("");
  const [addressForRoleRevoke, setAddressForRoleRevoke] = useState("");

  const [isReview, setIsReview] = useState(false);
  const handleReviewEvent = () => {
    setIsReview(true);
    console.log("Review event data...");
  };

  const [selectedRole, setSelectedRole] = useState(
    "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636",
  );
  const MEMBER_ROLE_HASH =
    "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636";
  const ADMIN_ROLE_HASH =
    "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
  const GUEST_ROLE_HASH =
    "0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f";

  const getRoleName = (selectedRole) => {
    switch (selectedRole) {
      case "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775":
        return "Admin Role";
      case "0x0000000000000000000000000000000000000000000000000000000000000000":
        return "Default Admin Role";
      case "0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f":
        return "Guest Role";
      case "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636":
        return "Member Role";
      default:
        return "Unknown Role";
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    console.log(`Role Selected ${getRoleName(event.target.value)}`);
  };

  const revokeRole = async (roleToRevoke, addressForRoleRevoke) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        displayCalendar,
        CalendarDailyTelos.abi,
        signer,
      );
      await contract.revokeRole(roleToRevoke, addressForRoleRevoke);
      const roleName = getRoleName(roleToRevoke); // Fetch selectedRole name
      toast({
        title: "Role Revoked",
        description: `Successfully revoked ${roleName} from ${addressForRoleRevoke}.`, // Use roleName instead of selectedRole
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke the selectedRole.",
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
                  Revoking user role...{" "}
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
                          Revoke Role
                        </FormLabel>
                        <Text>Select address and role to revoke. </Text>
                        <Select
            id="roleToRevoke-select"
            value={selectedRole}
            onChange={(e) => setRoleToRevoke(e.target.value)}
            placeholder="Select Role" // Placeholder option
          >
            <option value={MEMBER_ROLE_HASH}>Member Role</option>
            <option value={ADMIN_ROLE_HASH}>Admin Role</option>
            <option value={GUEST_ROLE_HASH}>Guest Role</option>
          </Select>

          <Input
            id="address-for-roleToRevoke"
            placeholder="Account Address"
            value={addressForRoleRevoke}
            onChange={(e) => setAddressForRoleRevoke(e.target.value)}
          />
        
                      </Box>

                      {addressForRoleRevoke && (
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
                    <Heading size="sm">Review Role Revocation</Heading>
                    <Box minHeight={200} p={2}>
                      <Text>Address: {inputAddress}</Text>
                      <Text>Role: {getRoleName(selectedRole)}</Text>
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
                      onClick={() => revokeRole(roleToRevoke, addressForRoleRevoke)}
                    >
                      Revoke Role
                    </Button>
                  </VStack>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Heading size="sm">Role Successfully Granted!</Heading>
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

export default RevokeRoleForm;
