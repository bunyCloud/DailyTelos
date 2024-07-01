import React, { useState } from "react";
import {
  Flex,
  Box,
  VStack,
  Text,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  Button,
} from "@chakra-ui/react";
import {
  Center,
  TabPanel,
  Tab,
  TabList,
  Tabs,
  TabPanels,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import FetchUserRole from "./Calendar/FetchUserRole";
import GetUserCalendars from "./Calendar/GetUserCalendars";
import DailyTelosMain from "./Calendar/DailyTelosMain";
import CalendarSelectorList from "./Calendar/CalendarSelectorList";
import IntroMp4 from "./Mp4/IntroMp4";

const SidebarLayout = ({ account, events, displayCalendar, handleFetch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listen to window resize to dynamically handle mobile view
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth < 768);
  });


  const sidebarContent = (
    <VStack align="stretch" spacing="2">
      <VStack w="100%">
        {account ? (
          <>
            <Box
              bg="white"
              p={1}
              w="100%"
              h="auto"
              borderRadius={6}
              border="2px solid ThreeDFace"
            >
              <Text as="b">Control Panel</Text>
              <FetchUserRole />
            </Box>
          </>
        ) : (
          <>
            <Box
              bg="white"
              p={2}
              w="100%"
              h="auto"
              borderRadius={6}
              border="2px solid ThreeDFace"
            >
              <Text as="b">No Connection Found...</Text>
              <Center mt={8}>
                <ConnectButton
                  label="Connect Wallet"
                  accountStatus="address"
                  chainStatus="icon"
                />
              </Center>
            </Box>
          </>
        )}
      </VStack>

      <VStack w="100%">
        <Box
          bg="white"
          p={2}
          w="100%"
          h="auto"
          borderRadius={6}
          border="2px solid ThreeDFace"
        >
          <Text as="b">Communities</Text>
          
          <Tabs size="sm" w="100%">
                <TabList>
                  <Tab>All Groups</Tab>
                  <Tab>My Groups</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={0}>
                    <Box bg="white" h="auto" w="auto">
                    <CalendarSelectorList fetchAllEvents={handleFetch} />            
                    </Box>
                  </TabPanel>
                  <TabPanel p={0}>
                    <Box h="auto" bg="white">
                      
                      <GetUserCalendars fetchAllEvents={handleFetch}/>
                    </Box>
                  </TabPanel>
                
                </TabPanels>
              </Tabs>
        </Box>
      </VStack>
    </VStack>
  );

  return (
    <Flex height="100%" bg="#0181cc">
      {/* Sidebar for mobile devices */}
      {isMobile && (
        <>
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            aria-label="Open sidebar"
            size="md"
            position="fixed"
            border='1px solid blue'
            p={3}
            zIndex="overlay"
          />
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>{sidebarContent}</DrawerBody>
              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      )}

      {/* Static Sidebar for larger screens */}
      {!isMobile && (
        <Box w="300px" p="2" overflowY="auto" bg="#0181cc" color="blue.700">
          {sidebarContent}
        </Box>
      )}

      {/* Main Content */}
      <Box flex="1" p="4px" h="100%">
        {!displayCalendar ? (
          <>
            <IntroMp4 />
          </>
        ) : (
          <>
            <DailyTelosMain events={events} />
          </>
        )}
      </Box>
    </Flex>
  );
};

export default SidebarLayout;
