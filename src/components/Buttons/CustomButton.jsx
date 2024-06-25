import React from 'react';
import { Button } from '@chakra-ui/react';
import styles from './Button30.module.css'; // Adjust the path as necessary

const CustomButton = ({ handleInputKeyPress, createCalendar }) => {
  return (
    <Button
      onKeyDown={handleInputKeyPress}
      size="sm"
      colorScheme="messenger"
      variant="solid"
      onClick={createCalendar}
      className={styles.button-30} // Apply the imported class name here
      style={{ width: "100px", margin: "2px", marginTop: "4px" }} 
    >
      Create
    </Button>
  );
};

export default CustomButton;
