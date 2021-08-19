import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Flex,
  Box,
  Heading,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import { HeaderNav } from "./HeaderNav";

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDrawerHeader = useBreakpointValue({
    xs: true,
    sm: true,
    md: true,
    lg: false,
  });

  if (isDrawerHeader) {
    return (
      <>
        <Flex
          w="100%"
          justify="space-between"
          mt="4"
          align="center"
          bgColor="gray.900"
        >
          <Heading color="yellow.400">VO</Heading>
          <Box>
            <button onClick={onOpen}>
              <HamburgerIcon fontSize="3xl" />
            </button>
          </Box>
        </Flex>
        <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="full">
          <DrawerOverlay>
            <DrawerContent p="4" bgColor="gray.900">
              <DrawerCloseButton mt="6" />
              <DrawerHeader>MENU</DrawerHeader>

              <DrawerBody>
                <HeaderNav />
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </>
    );
  }
  return (
    <>
      <Flex w="100%" justify="space-between" align="center" mt="8">
        <Heading color="yellow.400">VO</Heading>
        <HeaderNav />
      </Flex>
    </>
  );
}
