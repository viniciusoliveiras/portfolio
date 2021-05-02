import { Flex, Grid, Image, Text, Button, Link, Box } from '@chakra-ui/react';
import React from 'react';
import { DownloadResumeButton } from './DownloadResumeButton';

export function AboutMe() {
  return (
    <Grid
      templateColumns='repeat(2, 1fr)'
      mt={{ lg: '28', xl: '36' }}
      mx={{ lg: '24', xl: '32' }}
      gap={16}
      align='center'
      justify='center'
    >
      <Flex flexDirection='column' align='left'>
        <Text
          fontSize={{ lg: '4xl', xl: '5xl' }}
          fontWeight='bold'
          textAlign='left'
          w='100%'
        >
          Hi, I am Vinícius, <br />
          IT Student
        </Text>
        <Text textAlign='justify' fontSize={{ lg: 'sm', xl: 'md' }} mt='10'>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </Text>
        <DownloadResumeButton />
      </Flex>
      <Flex flexDirection='column' align='center'>
        <Image
          src='https://avatars.githubusercontent.com/u/64497059?v=4'
          borderRadius='full'
          boxSize={{ lg: '270', xl: '320' }}
        />
      </Flex>
    </Grid>
  );
}
