import React from 'react';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { FaGithub, FaInstagram, FaLinkedin, FaRocket } from 'react-icons/fa';
import { Link } from '@chakra-ui/react';

export function HeaderNav() {
  const isWideVersion = useBreakpointValue({
    xs: false,
    lg: true,
  });
  return (
    <>
      {isWideVersion && (
        <Flex
          as='header'
          w='100%'
          align='center'
          justify='flex-end'
          fontWeight='medium'
          fontSize={{ sm: 'lg', lg: 'xl' }}
        >
          <NavLink href='/home' mr='8'>
            Início
          </NavLink>
          <NavLink href='/about' mr='8'>
            Sobre
          </NavLink>
          <NavLink href='/projects' mr='8'>
            Projetos
          </NavLink>
          <NavLink href='/resume' mr='14'>
            Currículo
          </NavLink>
        </Flex>
      )}

      {!isWideVersion && (
        <Flex flexDirection='column'>
          <Flex
            as='header'
            w='100%'
            align='center'
            mt='6'
            fontWeight='medium'
            fontSize='lg'
            flexDirection='column'
          >
            <NavLink href='/home' mt='10'>
              Início
            </NavLink>
            <NavLink href='/about' mt='10'>
              Sobre
            </NavLink>
            <NavLink href='/projects' mt='10'>
              Projetos
            </NavLink>
            <NavLink href='/resume' mt='10'>
              Currículo
            </NavLink>
          </Flex>
          <Flex mt='32' justify='space-evenly'>
            <Link href='https://github.com/viniciusoliveiras' isExternal>
              <FaGithub fontSize='1.5rem' />
            </Link>

            <Link
              href='https://www.linkedin.com/in/viniciusoliveiras-01532/'
              isExternal
            >
              <FaLinkedin fontSize='1.5rem' />
            </Link>

            <Link href='https://www.instagram.com/svini.oliveira/' isExternal>
              <FaInstagram fontSize='1.5rem' />
            </Link>

            <Link
              href='https://app.rocketseat.com.br/me/viniciusoliveiras'
              isExternal
            >
              <FaRocket fontSize='1.5rem' />
            </Link>
          </Flex>
        </Flex>
      )}
    </>
  );
}
