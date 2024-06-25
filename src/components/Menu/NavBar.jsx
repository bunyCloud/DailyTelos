import { Box, Flex, VStack, Stack, Image, Link } from "@chakra-ui/react";
//import { Image } from "antd";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AppContext } from "../../AppContext";
import { useContext } from "react";

const NavBar = () => {
  const {
    account,
    chainId,
  } = useContext(AppContext);
  return (
    <Box px={2} mt={-1}>
      <Flex h={14} p={2} alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <VStack gap="auto" mt={3}>
            <Link href={'./'}>
            <Image
              //visible="false"
              src="/dailytelos-logo-2.png"
              width="150px"
              height="auto"
            />
            </Link>
            
          </VStack>
        </Box>

        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            
          <ConnectButton
                label="Connect"
                accountStatus="address"
                chainStatus="icon"
              />
            
          
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
