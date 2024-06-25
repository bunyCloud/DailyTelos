import React from 'react';
import { IconButton, useToast, Icon } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons'; // Or import it from where you have it defined in your project

const CopyToClipboardButton = ({ value, ...props }) => {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(
      function () {
        // Success!
        toast({
          title: "Copied to Clipboard",
          //description: value, // Optionally, you can set the copied value here
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      function (err) {
        // Failed
        toast({
          title: "Error copying text",
          //description: err ? err.message : '',
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  };

  return (
    <IconButton
      mt={-1}
      ml={-2}
      size={"xs"}
      variant={"unstyled"}
      onClick={handleCopy}
      icon={<CopyIcon />}
      {...props}
    />
  );
};

export default CopyToClipboardButton;
