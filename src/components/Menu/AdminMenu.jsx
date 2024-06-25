import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import CreateEventModal from '../Modals/CreateEventModal';
import AddMembersModal from '../Modals/AddMembersModal';
import GrantRoleModal from '../Modals/GrantRoleModal';
import RevokeRoleModal from '../Modals/RevokeRoleModal';
import CreateCalendarModal from '../Modals/CreateCalendarModal';
import styles from '../Buttons/Button30.module.css';
function AdminMenu() {
  return (
    <Menu>
      <MenuButton
      className={styles['button-30']}
        //px={4}
        w='100%'
       // py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
     //   bg='blue'
        fontSize='18px'
       // color='white'
        
        _hover={{ bg: '#019cdf' }}
        _expanded={{ bg: 'gray.300' }}
    //    _focus={{ boxShadow: 'outline' }}
      >
        Menu <ChevronDownIcon />
      </MenuButton>
      <MenuList w='330px'>
        <MenuItem>
          <CreateEventModal />
        </MenuItem>
        <MenuItem>
          <AddMembersModal />
        </MenuItem>
        <MenuItem>
          <GrantRoleModal />
        </MenuItem>
        <MenuItem>
          <RevokeRoleModal/>
        </MenuItem>
        <MenuItem>
          <CreateCalendarModal />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default AdminMenu;
