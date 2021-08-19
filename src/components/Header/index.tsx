import { HamburgerIcon } from '@chakra-ui/icons';
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
} from '@chakra-ui/react';

import { HeaderNav } from './HeaderNav';

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
          h="16"
          justify="space-between"
          align="center"
          position="fixed"
          top="0"
          left="0"
          zIndex="2"
          boxShadow="rgb(28, 28, 30) 0px 1rem 2rem"
          bgColor="gray.900"
          px={{ base: '4', sm: '8', md: '14', lg: '16', xl: '32' }}
        >
          <Heading color="yellow.400">VO</Heading>
          <Box>
            <button type="button" onClick={onOpen}>
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
      <Flex
        w="100%"
        h="20"
        justify="space-between"
        align="center"
        position="fixed"
        top="0"
        left="0"
        zIndex="2"
        boxShadow="rgb(28, 28, 30) 0px 1rem 2rem"
        bgColor="gray.900"
        px={{ base: '4', sm: '8', md: '14', lg: '16', xl: '32' }}
      >
        <Heading color="yellow.400">VO</Heading>
        <HeaderNav />
      </Flex>
    </>
  );
}
