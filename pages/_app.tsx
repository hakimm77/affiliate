import type { AppProps } from "next/app";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
require("@solana/wallet-adapter-react-ui/styles.css");

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: "#2596be",
        color: "#000",
        fontFamily: "Pixelify Sans",
      },
    }),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);

  useEffect(() => {}, [wallets]);

  return (
    <ChakraProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
