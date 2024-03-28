import { Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import Head from "next/head";
import { SwapComponent } from "../../components/SwapComponent";

const BuyAffiliate = () => {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");

  return (
    <Flex flexDir="column" alignItems="center">
      <Head>
        <title>Buy DINO</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />

      <Flex
        flexDir="column"
        mt={isMobile ? 5 : 85}
        mb={10}
        bgColor="#fff"
        width={isMobile ? "95%" : "50%"}
        borderRadius={20}
        p={isMobile ? 3 : 10}
        alignItems="center"
        fontFamily={"arial"}
      >
        <Text
          fontSize={isMobile ? 25 : 30}
          fontWeight={700}
          mb={10}
          fontFamily={"arial"}
          textAlign="center"
        >
          Be Part of{" "}
          <span style={{ color: "#2596be", fontFamily: "Pixelify Sans" }}>
            $DINO
          </span>{" "}
          Family
        </Text>

        <SwapComponent />
      </Flex>
    </Flex>
  );
};

export default BuyAffiliate;
