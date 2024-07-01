import React, { useContext, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { AppContext } from '../../AppContext';
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import { ethers } from "ethers";

const MemberRegistrationForm = ({ memberRegistrationFee }) => {
  const [amount, setAmount] = useState('');
  const { displayCalendar } = useContext(AppContext);
  const toast = useToast();

  const handleRegister = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
        const contract = new ethers.Contract(
            displayCalendar,
            CalendarDailyTelos.abi,
            signer,
          );
      const amountInWei = window.ethereum?.utils.toWei(amount.toString(), 'ether');
      await contract.methods.registerAsMember().send({ value: amountInWei });
      toast({
        title: 'Registration Successful',
        description: 'You are now registered as a member.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setAmount('');
    } catch (error) {
      console.error('Error registering as member:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <FormControl>
      <FormLabel>Amount of ETH to Register:</FormLabel>
      <Input
        type="number"
        placeholder={`Enter at least ${memberRegistrationFee / 10**18} ETH`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button mt={2} onClick={handleRegister} colorScheme="teal">
        Register as Member
      </Button>
      <Text mt={2} fontSize="sm" fontStyle="italic">
        Minimum registration fee: {memberRegistrationFee / 10**18} ETH
      </Text>
    </FormControl>
  );
};

export default MemberRegistrationForm;
