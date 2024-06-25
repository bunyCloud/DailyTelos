import { Box, Heading, VStack, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import useIpfsFactory from '../../hooks/use-ipfs-factory';
import useIpfs from '../../hooks/use-ipfs';

const IpfsNode = () => {
  const bgError = useColorModeValue("red.500", "red.300");
  const bgSection = useColorModeValue("gray.100", "gray.700");
  const colorError = useColorModeValue("white", "gray.800");

  // Initialize IPFS and handle errors
  const { ipfs, ipfsInitError } = useIpfsFactory({ commands: ['id'] });

  // Fetch IPFS ID details
  const id = useIpfs(ipfs, 'id');

  // State for storing IPFS version details
  const [version, setVersion] = useState(null);

  // Effect hook to fetch IPFS version when ipfs instance is available
  useEffect(() => {
    if (!ipfs) return; // Exit if IPFS is not initialized

    const getVersion = async () => {
      try {
        const nodeVersion = await ipfs.version();
        setVersion(nodeVersion);
      } catch (error) {
        console.error('Failed to fetch IPFS version:', error);
      }
    };

    getVersion();
  }, [ipfs]);

  return (
    <div>
      {ipfsInitError && (
        <Box
          bg={bgError}
          p={3}
          maxWidth="700px"
          m="auto"
          mt={3}
          color={colorError}
          textAlign="center"
        >
          Error: {ipfsInitError.message || ipfsInitError}
        </Box>
      )}
      {(id || version) && (
        <Box
          bg={bgSection}
          maxWidth="700px"
          m="auto"
          mt={5}
          p={4}
          borderRadius="lg"
        >
          <VStack spacing={4}>
            <Heading as="h1" size="lg" fontWeight="normal" py={3} color="teal.500">
              Connected to IPFS
            </Heading>
            {id && <IpfsId obj={id} keys={['id', 'agentVersion']} />}
            {version && <IpfsId obj={version} keys={['version']} />}
          </VStack>
        </Box>
      )}
    </div>
  );
};

const Title = ({ children }) => {
  return (
    <h2 className='f5 ma0 pb2 aqua fw4 montserrat'>{children}</h2>
  )
}

const IpfsId = ({keys, obj}) => {
  if (!obj || !keys || keys.length === 0) return null
  return (
    <>
      {keys?.map((key) => (
        <div className='mb4' key={key}>
          <Title>{key}</Title>
          <div  data-test={key}>{obj[key].toString()}</div>
        </div>
      ))}
    </>
  )
}

export default IpfsNode;
