/* eslint-disable jsx-a11y/accessible-emoji */
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';

import { Header } from '../components/Header';

export default function Custom404() {
  return (
    <Flex
      flexDirection="column"
      mx={{ base: '4', sm: '8', md: '14', lg: '24', xl: '32' }}
      justifyContent="space-between"
      h="100vh"
    >
      <Header />
      <Flex
        flex="1"
        flexDirection="column"
        align="center"
        justify="space-evenly"
        mt={{ xs: '4', md: '10', lg: '12' }}
        py="2"
      >
        <Box>
          <Heading fontSize={{ xs: '7xl', md: '8xl' }} textAlign="center">
            😳
          </Heading>

          <Heading fontSize={{ xs: '5xl', md: '7xl' }} textAlign="center">
            Whoops!
          </Heading>

          <Text mt="8" fontSize={{ xs: '2xl', md: '3xl' }} textAlign="center">
            404 | Página não encontrada
          </Text>
        </Box>

        <Text fontSize={{ xs: 'xl', md: '2xl' }} textAlign="center">
          Parece que esta página é tímida e não quer aparecer no portfólio
        </Text>

        <Link href="/home" textDecoration="none" w="min" h="3rem" color="white">
          <Box
            as="button"
            bgColor="yellow.400"
            color="gray.900"
            w="max"
            p="2"
            fontWeight="medium"
            fontSize="lg"
            borderRadius="4"
            _hover={{ transition: 0.2, filter: 'brightness(0.9)' }}
          >
            Voltar para o Início
          </Box>
        </Link>
      </Flex>
    </Flex>
  );
}
