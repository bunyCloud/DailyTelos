import { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client';
import { useToast } from '@chakra-ui/react';
import { Buffer } from "buffer";

const projectId = "2RMVb2CNm5bmXOtwFsrIyAXnNqx";
const projectSecret = "b516ce6e2e07f1828d70cf50df87f859";
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// IPFS client configuration
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

export function useIpfsUploader(onUploadSuccess) {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const uploadFile = async () => {
      if (!file) return;

      setIsUploading(true);
      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`Upload progress: ${prog}`),
        });
        const url = `https://ipfs.io/ipfs/${added.path}`;
        setImageUrl(url);
        console.log("Uploaded image to IPFS:", url);
        
        if(onUploadSuccess) {
          onUploadSuccess(added.path);
        }

        // Use a consistent toast ID for upload success notifications
        toast({
          id: "ipfs-upload-success", // Consistent ID
          title: "IPFS Upload Confirmed!",
          description: `Your file has been uploaded to IPFS: ${url}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error uploading file to IPFS:", error);
        // Use a consistent toast ID for upload failure notifications
        toast({
          id: "ipfs-upload-error", // Consistent ID
          title: "IPFS Upload Failed",
          description: "An error occurred while uploading the file to IPFS.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsUploading(false);
      }
    };

    uploadFile();
  }, [file]); // Dependencies

  return { setFile, imageUrl, isUploading };
}
