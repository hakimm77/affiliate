import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Input,
  Select,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { useRouter } from "next/router";
import axios from "axios";

const tokens = [
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
  },
];

const dino = {
  mint: "HPZ3QSXkkDezSS1gkRRKys3LhDGXDUb9fGpH9mZGF5Zr",
  decimals: 8,
};

export const SwapComponent = () => {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");
  const [quote, setQuote] = useState(null);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState(0);
  const [successLink, setSuccessLink] = useState<any>(null);
  const [refWallet, setRefWallet] = useState("");
  const [status, setStatus] = useState<"error" | "success" | "loading" | null>(
    null
  );
  const router = useRouter();
  const wallet = useWallet();

  const connection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=57c00df3-b19d-4030-90b6-be3e46c2ca5c"
  );

  useEffect(() => {
    if (router.query?.address) {
      setRefWallet(router.query?.address as string);
    }
  }, [router]);

  const updateUser = async (transactionAmount: number) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_APP_URL}/api/updateUser`, {
        buyerWallet: wallet.publicKey?.toBase58(),
        refWallet: refWallet,
        transactionAmount: transactionAmount,
      })
      .then((response) => {
        // console.log(response.data);
      });
  };

  const getQuote = async () => {
    if (isNaN(Number(fromAmount)) || Number(fromAmount) <= 0) {
      alert(`Invalid input value: ${fromAmount}`);
      return;
    }

    const quote = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${
          tokens[selectedTokenIndex].mint
        }&outputMint=${dino.mint}&amount=${
          Number(fromAmount) * Math.pow(10, tokens[selectedTokenIndex].decimals)
        }&slippage=0.5`
      )
    ).json();

    if (quote && quote.outAmount) {
      const outAmountNumber =
        Number(quote.outAmount) / Math.pow(10, dino.decimals);
      console.log(quote);
      setToAmount(outAmountNumber);
    }

    setQuote(quote);
  };

  async function signAndSendTransaction() {
    if (
      !wallet.connected ||
      !wallet.signTransaction ||
      isNaN(Number(fromAmount)) ||
      Number(fromAmount) <= 0
    ) {
      alert("Wallet is not connected or does not support signing transactions");
      return;
    }

    setStatus("loading");

    const swapResponse = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: wallet.publicKey?.toString(),
          wrapAndUnwrapSol: true,
          prioritizationFeeLamports: "auto",
        }),
      })
    ).json();

    try {
      const swapTransactionBuf = Buffer.from(
        swapResponse.swapTransaction,
        "base64"
      );
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();

      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });
      const latestBlockHash = await connection.getLatestBlockhash();

      console.log("confirming the transaction");
      await connection
        .confirmTransaction(
          {
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid,
          },
          "confirmed"
        )
        .then(async (res) => {
          console.log("hybey", res);

          setSuccessLink(`https://solscan.io/tx/${txid}`);
          setStatus("success");
          await updateUser(
            Number((quote as any).outAmount) / Math.pow(10, dino.decimals)
          );
        })
        .catch((err) => {
          setStatus("error");
          console.log(err);
          return;
        });
    } catch (error) {
      console.error("Error signing or sending the transaction:", error);
    }
  }

  const displayAlert = () => {
    switch (status) {
      case "error":
        return (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Transaction Failed</AlertTitle>
            <AlertDescription>Something went wrong, try again</AlertDescription>
          </Alert>
        );
      case "success":
        return (
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>Transaction Succeeded</AlertTitle>
            <AlertDescription>
              <a href={successLink} style={{ color: "blue" }} target="_blank">
                View Transaction
              </a>
            </AlertDescription>
          </Alert>
        );
      case "loading":
        return (
          <Alert status="loading">
            <AlertIcon />
            <AlertTitle>Transaction Loading</AlertTitle>
            <AlertDescription>Confirming transaction...</AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      w={isMobile ? "100%" : "70%"}
      bgColor="#314254"
      p={isMobile ? 5 : 10}
      borderRadius={20}
    >
      <ConnectWallet />
      <Flex flexDir="column" w="100%" mb={10} mt={isMobile ? 5 : 10}>
        <Flex
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          w="100%"
          bgColor="#212128"
          p={5}
          borderRadius={50}
          mb={5}
        >
          <Input
            isDisabled={!wallet.connected}
            value={fromAmount}
            placeholder="00.0"
            w="80%"
            border="none"
            color={"white"}
            onChange={(e) => {
              setFromAmount(e.target.value);
            }}
            fontSize={20}
          />
          <Select
            isDisabled={!wallet.connected}
            bgColor={"white"}
            color="#1d1d1d"
            fontWeight="bold"
            w="150px"
            onChange={(event) => {
              setSelectedTokenIndex(Number(event.target.value));
            }}
          >
            {tokens.map((token, idx) => (
              <option
                value={idx}
                key={idx}
                style={{ backgroundColor: "#1d1d1d", color: "white" }}
              >
                {token.name}
              </option>
            ))}
          </Select>
        </Flex>

        <Button w="fit-content" alignSelf="center" mb={5} onClick={getQuote}>
          Quote 🔄
        </Button>

        <Flex
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          w="100%"
          bgColor="#212128"
          p={5}
          borderRadius={50}
        >
          <Input
            readOnly
            placeholder="00.0"
            w="80%"
            border="none"
            color={"white"}
            value={toAmount.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            fontSize={20}
          />
          <Button>DINO</Button>
        </Flex>
      </Flex>

      <Button
        isLoading={status === "loading"}
        isDisabled={!wallet.connected}
        bgColor={"#1d1d1d"}
        color="#fff"
        w="50%"
        h={50}
        fontSize={23}
        fontFamily={"Pixelify Sans"}
        _hover={{ opacity: 0.7 }}
        onClick={signAndSendTransaction}
        mb={5}
      >
        Buy $DINO
      </Button>

      {displayAlert()}
    </Flex>
  );
};
