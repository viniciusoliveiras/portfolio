import { Flex, Grid, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';
import { DownloadResumeButton } from './DownloadResumeButton';

export function AboutMe() {
  const isWideVersion = useBreakpointValue({
    xs: false,
    sm: false,
    md: true,
  });

  return (
    <>
      {isWideVersion && (
        <Grid
          templateColumns='repeat(2, 1fr)'
          mt={{ md: '24', lg: '32', xl: '36' }}
          mx={{ md: '16', lg: '24', xl: '32' }}
          gap={16}
          align='center'
          justify='center'
        >
          <Flex flexDirection='column' align='left'>
            <Text
              fontSize={{ md: '3xl', lg: '4xl', xl: '5xl' }}
              fontWeight='bold'
              textAlign='left'
              w='100%'
            >
              Olá, eu sou Vinícius, <br />
              Estudante de TI
            </Text>
            <Text
              textAlign='justify'
              fontSize={{ md: 'sm', lg: 'md', xl: 'md' }}
              mt='10'
              mb='12'
            >
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
              Exercitation veniam consequat sunt nostrud amet.
            </Text>
            <DownloadResumeButton />
          </Flex>
          <Flex flexDirection='column' align='center'>
            <Image
              src='https://avatars.githubusercontent.com/u/64497059?v=4'
              borderRadius='full'
              boxSize={{ md: '270', lg: '270', xl: '320' }}
            />
          </Flex>
        </Grid>
      )}

      {!isWideVersion && (
        <Grid mt='10' mx='12' gap={16} align='center' justify='center'>
          <Flex flexDirection='column' align='center'>
            <Image
              src='https://avatars.githubusercontent.com/u/64497059?v=4'
              borderRadius='full'
              boxSize={{ xs: '200', sm: '250' }}
            />
          </Flex>
          <Flex flexDirection='column' align='center'>
            <Text
              fontSize={{ xs: '2xl', sm: '3xl' }}
              fontWeight='bold'
              w='100%'
            >
              Hi, I am Vinícius, <br />
              IT Student
            </Text>
            <Text fontSize={{ xs: 'sm', sm: 'md' }} mt='6' mb='10'>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
              Exercitation veniam consequat sunt nostrud amet.
            </Text>
            <DownloadResumeButton />
          </Flex>
        </Grid>
      )}
    </>
  );
}
