import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { Box, Text, Spinner } from '@chakra-ui/react';
import { AppContext } from '../../AppContext';


const MemberRegistrationFee = () => {
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const { displayCalendar, rpcUrl, calendarABI } = useContext(AppContext);

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(rpcUrl);
        const contract = new ethers.Contract(
            displayCalendar,
            calendarABI,
            provider,
          );
        const feeInWei = await contract.memberRegistrationFee();
        const feeInEther = ethers.utils.formatEther(feeInWei);
        setFee(feeInEther);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching registration fee:", error);
        setLoading(false);
      }
    };

    fetchFee();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center">
        <Spinner size="lg" />
        <Text>Loading registration fee...</Text>
      </Box>
    );
  }

  return (
    <Box textAlign="center">
      <Text fontSize="xl">Member Registration Fee:</Text>
      <Text fontSize="2xl" fontWeight="bold">{fee} TLOS</Text>
    </Box>
  );
};

export default MemberRegistrationFee;
