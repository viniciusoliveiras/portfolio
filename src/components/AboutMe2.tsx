import { Flex, Grid, Text, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';

export function AboutMe2() {
  const isWideVersion = useBreakpointValue({
    xs: false,
    sm: false,
    md: true,
  });

  return (
    <>
      {isWideVersion && (
        <Flex
          mt="8"
          mb="8"
          px={{ md: '16', lg: '36' }}
          flex="1"
          flexDirection="column"
          justify="space-around"
        >
          <Flex justify="space-between" align="center" flex="1">
            <Text fontSize="2xl">Um pouco sobre mim</Text>
            <Link href="/about">
              <Text color="cyan.500">Ver mais</Text>
            </Link>
          </Flex>

          <Flex mt="6" fontSize="xl" justify="space-between" w="80vw">
            <Text>
              Desde criança sempre gostei muito de computadores e entrei no
              universo da programação na faculdade
            </Text>

            <Text>
              Sempre que possível, aplico tudo o que aprendo nos desafios do
              curso e em alguns projetos, como{' '}
              <span className="highlightText">esse site,</span> por exemplo
            </Text>
          </Flex>
        </Flex>
      )}

      {!isWideVersion && (
        <Flex
          mt="8"
          mb="8"
          px="10"
          flex="1"
          flexDirection="column"
          justify="space-around"
          align="center"
        >
          <Text fontSize="xl">Um pouco sobre mim</Text>

          <Grid
            templateColumns="repeat(1, 1fr)"
            mt="10"
            gap={12}
            align="center"
            justify="center"
          >
            <Flex
              flexDirection="column"
              justify="space-evenly"
              textAlign="left"
              fontSize="lg"
            >
              <Text>
                Desde criança sempre gostei muito de computadores e entrei no
                universo da programação na faculdade
              </Text>

              <Text mt="8">
                Sempre que possível, aplico tudo o que aprendo nos desafios do
                curso e em alguns projetos, como{' '}
                <span className="highlightText">esse site,</span> por exemplo
              </Text>
            </Flex>
          </Grid>

          <Flex justify="center" align="center" flex="1" mt="8">
            <Link href="/about">
              <Text color="cyan.500">Ver mais</Text>
            </Link>
          </Flex>
        </Flex>
      )}
    </>
  );
}
