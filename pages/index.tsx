import { extendTheme, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { Navbar } from "../components/Navbar";
import { AffiliateComponent } from "../components/AffiliateComponent";

const Home: NextPage = () => {
  return (
    <Flex flexDir="column" alignItems="center">
      <Head>
        <title>$DINO Affiliate</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />
      <AffiliateComponent />
    </Flex>
  );
};

export default Home;
