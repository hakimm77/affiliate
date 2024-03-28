import { Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { disconnect } from "process";
import { useEffect } from "react";

const WalletDisconnectButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
  { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const ConnectWallet = () => {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");
  const { publicKey, disconnecting, disconnect, connect } = useWallet();

  useEffect(() => {
    if (publicKey && typeof window !== "undefined") {
      window.localStorage.setItem("wallet_address", publicKey?.toBase58());
    }
  }, [publicKey]);

  return (
    <Flex flexDir={isMobile ? "column" : "row"} alignItems="center">
      <WalletMultiButtonDynamic
        onClick={async () => {
          await connect();
          window.localStorage.setItem(
            "wallet_address",
            publicKey?.toBase58() as string
          );
        }}
        style={{
          backgroundColor: "#2596be",
          marginRight: 10,
          borderRadius: 50,
          marginBottom: isMobile ? 10 : 0,
        }}
      />
      <WalletDisconnectButtonDynamic
        style={{ borderRadius: 50 }}
        onClick={async () => {
          await disconnect();
          localStorage.removeItem("wallet_address");
          window.location.reload();
        }}
      />
    </Flex>
  );
};
