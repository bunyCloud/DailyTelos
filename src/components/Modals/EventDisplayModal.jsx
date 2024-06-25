import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Box, Text, Avatar, VStack, HStack } from '@chakra-ui/react';

const EventDisplayModal = ({ calendarAddress, selectedEvent, isVisible, onClose }) => {
  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#103e8e" color="white">
        
        <ModalCloseButton />
        <ModalBody>
        <VStack>
              
              {selectedEvent && (
                <>
                <Avatar size="xl" border={'3px solid white'} name={selectedEvent.title} src={selectedEvent.metadataURI} />{' '}
                  <Box w={'auto'} h="auto" p={4}>
                    <Text as="b" fontSize={'18px'} borderBottom="1px solid silver">
                      {selectedEvent.title}
                    </Text>
                    <Text fontSize="12px">Organizer: {selectedEvent.organizer}</Text>

                    <Text fontSize={'12px'} noOfLines={4}>
                      {selectedEvent.description}
                    </Text>

                    <HStack p={2}>
                      <Text fontSize="12px" noOfLines={2}>
                        Start: {selectedEvent.start.toString()}
                      </Text>
                      <Text fontSize="12px" noOfLines={2}>
                        Ends: {selectedEvent.end.toString()}
                      </Text>
                    </HStack>
                  </Box>
                </>
              )}
            </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EventDisplayModal;
