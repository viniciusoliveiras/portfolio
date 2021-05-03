import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Header } from '../components/Header';

export default function Custom404() {
  return (
    <>
      <Header />
      <Flex
        align='center'
        justify='center'
        mt={{ xs: '4', md: '10', lg: '12' }}
        flexDirection='column'
        p={{ md: '0', lg: '6' }}
      >
        <Heading fontSize={{ xs: '7xl', md: '8xl' }} textAlign='center'>
          😳
        </Heading>

        <Heading
          fontSize={{ xs: '5xl', md: '7xl' }}
          mt={{ xs: '2', md: '4', lg: '6' }}
          textAlign='center'
        >
          Whoops!
        </Heading>

        <Text
          fontSize={{ xs: '2xl', md: '3xl' }}
          mt={{ xs: '6', md: '10', lg: '12' }}
          textAlign='center'
        >
          404 | Página não encontrada
        </Text>

        <Text
          fontSize={{ xs: 'xl', md: '2xl' }}
          mt={{ xs: '6', md: '6', lg: '12' }}
          textAlign='center'
        >
          Parece que esta página é tímida e não quer aparecer no portfólio
        </Text>

        <Link
          href='/home'
          textDecoration='none'
          w='min'
          h='3rem'
          color='white'
          mt={{ xs: '10', md: '10', lg: '20' }}
        >
          <Box
            as='button'
            bgColor='red.400'
            w='max'
            p='2'
            fontWeight='medium'
            fontSize='lg'
            borderRadius='4'
            _hover={{ transition: 0.2, filter: 'brightness(0.9)' }}
          >
            Voltar para o Início
          </Box>
        </Link>
      </Flex>
    </>
  );
}
