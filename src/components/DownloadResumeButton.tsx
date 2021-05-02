import { Box, Link } from '@chakra-ui/react';
import React from 'react';

export function DownloadResumeButton() {
  return (
    <Link
      href='https://drive.google.com/file/d/1Dvy_sokJymNN5AaTF3Doy4biK6Fp-fXW/view?usp=sharing'
      isExternal
      textDecoration='none'
      w='min'
      h='3rem'
      color='white'
      mt='12'
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
        Download Resume
      </Box>
    </Link>
  );
}
