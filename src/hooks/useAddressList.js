import { Text } from "@chakra-ui/react";

function AddressList({ title, addresses, formatter }) {
  return (
    <div style={{ fontSize: "12px" }}>
      <Text as="b">{title}</Text>
      <div>
        {addresses.map((address, index) => (
          <div key={index}>
            {address && (
              <>
                <Text fontSize={"12px"}>{formatter(address)}</Text>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddressList;
