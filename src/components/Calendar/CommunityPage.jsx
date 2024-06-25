import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Text,
  Stack,
  Box,
  Center,
  HStack,
  GridItem,
  Grid,
  Link,
  VStack,
} from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { AppContext } from "../../AppContext";
import FetchCalendarInfoDynamic from "./FetchCalendarInfoDynamic";
import FetchAddresses from "./FetchAddresses";
import FetchAllEventsDynamic from "./FetchAllEventsDynamic";
import { HomeOutlined } from "@ant-design/icons";
import CalendarDailyTelos from "../../contracts/CalendarDailyTelos.json";
import { ethers } from "ethers";


// CommunityPage component
const CommunityPage = () => {
  const { calendarAddress } = useParams();
  const { rpcUrl, account } = useContext(AppContext);
  const [owner, setOwner] = useState("");
  const [isOwner, setIsOwner] = useState(false);


  

  useEffect(() => {
   
  const fetchUserOwner = async () => {
    setIsOwner(false)
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
      calendarAddress,
      CalendarDailyTelos.abi,
      provider,
    );
    const o = await contract.owner();
    if (o) {
      setOwner(o);
      setIsOwner(true);
    }
  };
    fetchUserOwner();
  }, [calendarAddress, rpcUrl]);


  const ADMIN_ROLE =
    "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
  const MEMBER_ROLE =
    "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636";
  const GUEST_ROLE =
    "0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f";

  if (!calendarAddress) {
    return <Center mt={60}>Loading...</Center>;
  }
  

  if(account === owner) {

  }

  return (
    <Center mt={2} bg="#0181cc">
    <VStack>
      <Box bg="white" p={8} overflow="hidden" mt={4} mb={4}>
        <Link href="./" isExternal>
          <HomeOutlined style={{ fontSize: "26px", color: "#019cdf" }} />
        </Link>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p="3"
          borderBottomWidth="1px"
        >
          <Stack spacing="3">
            <FetchCalendarInfoDynamic owner={owner} calendarAddress={calendarAddress} />
            
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={"auto"}
              width="auto"
              height="100%"
              //maxWidth={350}
            >
            {/**
              <GridItem>
                <Box
                  height="100%"
                  width="100%"
                  padding={4}
                  borderWidth="1px"
                  borderRadius="lg"
                >
                  <HStack>
                    <Text fontSize="lg">Administrators</Text>
                  </HStack>
                  <FetchAddresses role={ADMIN_ROLE} roleName={"Admin"} />
                </Box> 
              </GridItem>
              */}
              <GridItem>
                <Box
                  height="100%"
                  width="100%"
                  padding={2}
                  borderWidth="1px"
                  borderRadius="lg"
                >
                  <HStack>
                    <Text fontSize="md" as='b'>Members</Text>
                  </HStack>
                  <FetchAddresses role={MEMBER_ROLE} roleName={"Members"} />
                </Box>
              </GridItem>
              <GridItem>
                <Box
                  height="100%"
                  width="100%"
                  padding={2}
                  borderWidth="1px"
                  borderRadius="lg"
                >
                  <HStack>
                    <Text fontSize="md" as='b'>Guests</Text>
                  </HStack>
                  <FetchAddresses role={GUEST_ROLE} roleName={"Guest"} />
                </Box>
              </GridItem>
            </Grid>
          </Stack>
        </Flex>

        <Flex
          p={4}
          bg="ThreeDFace"
          justifyContent="space-between"
          borderTopWidth="1px"
        >
          <FetchAllEventsDynamic calendarAddress={calendarAddress} />
        </Flex>
      </Box>



      </VStack>
    </Center>

  );
};

export default CommunityPage;
