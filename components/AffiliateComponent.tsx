import {
  Button,
  Flex,
  Input,
  Text,
  useClipboard,
  useMediaQuery,
} from "@chakra-ui/react";
import { ButtonComponent } from "./ButtonComponent";
import { useEffect, useState } from "react";
import Image from "next/image";

export const AffiliateComponent = () => {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");
  const [walletAddress, setWalletAddress] = useState("");
  const { hasCopied, onCopy } = useClipboard(
    `https://youtube.com/ref/${walletAddress}`
  );

  const connectWallet = async () => {
    try {
      const { solana } = window as any;
      if (solana) {
        if (solana.isPhantom) {
          console.log("phantom wallet found");
          const response = await solana.connect({ onlyIfTrusted: false });
          console.log("public key", response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
          await localStorage.setItem("wallet", response.publicKey.toString());
        } else {
          alert("Please install phantom wallet");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWalletAddress(localStorage.getItem("wallet") || "");
    }
  }, []);

  return (
    <Flex
      flexDir="column"
      mt={isMobile ? 5 : 100}
      bgColor="#fff"
      width={isMobile ? "95%" : "50%"}
      //   h={500}
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

      {walletAddress ? (
        <Flex flexDir="column" w="100%" alignItems="center">
          <Flex
            px={3}
            flexDir="row"
            borderColor={"green"}
            borderWidth={2}
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={require("../assets/wallet-logo.png")}
              alt="phantom-wallet"
              style={{ width: 75 }}
            />
            <Text mr={3} fontWeight={"600"}>{`${walletAddress.substring(
              0,
              4
            )}...${walletAddress.substring(walletAddress.length - 4)}`}</Text>
          </Flex>

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
              value={`https://youtube.com/ref/${walletAddress}`}
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
                20
              </Text>
            </Flex>

            <Flex flexDir="column" alignItems="center">
              <Text mb={1} fontSize={isMobile ? 20 : 25}>
                Generated tokens
              </Text>
              <Text fontSize={isMobile ? 19 : 23} fontWeight="bold">
                10,000 $DINO
              </Text>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <ButtonComponent
          text="Connect Wallet"
          inverseColor
          onClick={connectWallet}
        />
      )}
    </Flex>
  );
};
