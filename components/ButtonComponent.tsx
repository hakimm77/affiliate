import { Button } from "@chakra-ui/react";

export const ButtonComponent = ({
  text,
  inverseColor,
  onClick,
}: {
  text: string;
  onClick?: () => void;
  inverseColor?: boolean;
}) => {
  return (
    <Button
      bgColor={inverseColor ? "#000" : "#fff"}
      color={inverseColor ? "#fff" : "#000"}
      fontSize={25}
      borderRadius={50}
      px={10}
      py={8}
      mx={5}
      _hover={{ opacity: 0.7 }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
