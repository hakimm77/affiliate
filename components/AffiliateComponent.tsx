import {
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  useClipboard,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { getUserInfo } from "../utils/functions/getUserInfo";
import { User } from "../utils/types/userType";

export const AffiliateComponent = () => {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");
  const [walletAddress, setWalletAddress] = useState("");
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const { onCopy } = useClipboard(
    `${process.env.NEXT_PUBLIC_APP_URL}/ref/${userInfo?.address}`
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWalletAddress(localStorage.getItem("wallet_address") || "");
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      getUserInfo(walletAddress, setUserInfo);
    }
  }, [walletAddress]);

  return (
    <Flex
      flexDir="column"
      mt={isMobile ? 5 : 100}
      bgColor="#fff"
      width={isMobile ? "95%" : "50%"}
      borderRadius={20}
      p={isMobile ? 5 : 20}
      alignItems="center"
      fontFamily={"arial"}
    >
      <Text
        fontSize={isMobile ? 25 : 30}
        fontWeight={700}
        mb={isMobile ? 10 : 20}
        fontFamily={"arial"}
        textAlign="center"
      >
        Invite new people and earn{" "}
        <span style={{ color: "#2596be", fontFamily: "Pixelify Sans" }}>
          $DINO
        </span>
      </Text>

      <ConnectWallet />

      {userInfo ? (
        <Flex flexDir="column" w="100%" alignItems="center" mt={5}>
          <Flex
            mt={5}
            width={isMobile ? "100%" : "60%"}
            flexDir="row"
            alignItems="center"
            justifyContent="center"
            mb={10}
          >
            <Input
              borderColor="black"
              borderWidth={1}
              value={`${process.env.NEXT_PUBLIC_APP_URL}/ref/${userInfo?.address}`}
              isReadOnly
              placeholder="Enter affiliate link"
            />

            <Button
              bgColor="#000"
              color="#fff"
              _hover={{ opacity: 0.7 }}
              onClick={onCopy}
            >
              Copy
            </Button>
          </Flex>

          <Flex
            w={isMobile ? "100%" : "80%"}
            flexDir={isMobile ? "column" : "row"}
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex flexDir="column" alignItems="center" mb={isMobile ? 5 : 0}>
              <Text mb={1} fontSize={isMobile ? 20 : 25}>
                Invited users
              </Text>
              <Text fontSize={isMobile ? 19 : 23} fontWeight="bold">
                {userInfo.invited}
              </Text>
            </Flex>

            <Flex flexDir="column" alignItems="center">
              <Text mb={1} fontSize={isMobile ? 20 : 25}>
                Generated tokens
              </Text>
              <Text fontSize={isMobile ? 19 : 23} fontWeight="bold">
                {userInfo.tokens} $DINO
              </Text>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Spinner mt={10} size="xl" />
      )}
    </Flex>
  );
};
