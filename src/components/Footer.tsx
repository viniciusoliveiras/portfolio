import React from 'react';
import {
  Flex,
  Text,
  Grid,
  Tooltip,
  Icon,
  Link,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaGithub, FaInstagram, FaLinkedin, FaRocket } from 'react-icons/fa';

export function Footer() {
  const isWideVersion = useBreakpointValue({
    xs: false,
    sm: false,
    md: true,
  });

  return (
    <Flex flexDirection='column' align='center' px='8'>
      <Flex mt='16' justify='space-between' w='60'>
        <Link href='https://github.com/viniciusoliveiras' isExternal>
          <Icon as={FaGithub} fontSize={{ xs: '1.5rem', md: '2rem' }} />
        </Link>

        <Link
          href='https://www.linkedin.com/in/viniciusoliveiras-01532/'
          isExternal
        >
          <Icon as={FaLinkedin} fontSize={{ xs: '1.5rem', md: '2rem' }} />
        </Link>

        <Link href='https://www.instagram.com/svini.oliveira/' isExternal>
          <Icon as={FaInstagram} fontSize={{ xs: '1.5rem', md: '2rem' }} />
        </Link>

        <Link
          href='https://app.rocketseat.com.br/me/viniciusoliveiras'
          isExternal
        >
          <Icon as={FaRocket} fontSize={{ xs: '1.5rem', md: '2rem' }} />
        </Link>
      </Flex>
      <Flex align='center' justify='center' my='6'>
        {isWideVersion && (
          <Text textAlign='center'>
            © 2021 Vinícius Oliveira. All rights reserved.
          </Text>
        )}
        {!isWideVersion && (
          <Text textAlign='center'>
            © 2021 Vinícius Oliveira.
            <br /> All rights reserved.
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
