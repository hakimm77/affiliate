import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import { ButtonComponent } from "./ButtonComponent";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export const Navbar = () => {
  const [isMobile] = useMediaQuery("(max-width: 1200px)");
  const router = useRouter();

  const navItems = [
    {
      name: "Roadmap",
      route: "/",
    },
    {
      name: "Tokenomics",
      route: "/",
    },
    {
      name: "Affiliate Program",
      route: "/",
      selected: true,
    },
  ];
  return (
    <Flex
      w={isMobile ? "100%" : "65%"}
      flexDir={"row"}
      alignItems="center"
      justifyContent="space-between"
    >
      <Image
        src={require("../assets/dino-logo.png")}
        alt="logo"
        style={{ width: 100, cursor: "pointer" }}
        onClick={() => {
          router.push("/");
        }}
      />

      {isMobile ? (
        <Menu>
          <MenuButton>
            <Icon
              as={() => <HamburgerIcon color="#fff" w={10} h={10} mr={3} />}
            />
          </MenuButton>
          <MenuList>
            {navItems.map((item, i) => (
              <MenuItem key={i}>{item.name}</MenuItem>
            ))}
            <MenuItem>Buy $DINO</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Flex flexDir="row" alignItems="center">
          {navItems.map((item, i) => (
            <Text
              key={i}
              px={5}
              fontSize={23}
              color={item.selected ? "#000" : "#fff"}
              textDecoration={item.selected ? "underline" : "none"}
              _hover={{ color: "#000", textDecoration: "underline" }}
              cursor="pointer"
            >
              {item.name}
            </Text>
          ))}
          <ButtonComponent text="Buy $DINO" />
        </Flex>
      )}
    </Flex>
  );
};
