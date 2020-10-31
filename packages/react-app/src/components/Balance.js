import React from "react";

import { Flex, Text } from "@chakra-ui/core";
import { useUserWallet } from "../contexts/DappContext";

const Balance = () => {
  const [userWallet] = useUserWallet();
  return userWallet ? (
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="black"
      color="white"
    >
      <Text>xDai: {userWallet?.eth}</Text>
      <Text>
        $CHIEV: {userWallet?.chiev}
      </Text>
    </Flex>
  ) : null;
};

export default Balance;
