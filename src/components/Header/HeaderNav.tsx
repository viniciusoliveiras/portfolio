import React from 'react';
import { Flex, useBreakpointValue, Link } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import {
  RiHome2Line,
  RiInformationLine,
  RiCodeSSlashLine,
  RiFile2Line,
} from 'react-icons/ri';

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
          <NavLink href='/home' mr='8' title='Início'>
            <RiHome2Line />
          </NavLink>
          <NavLink href='/about' mr='8' title='Sobre'>
            <RiInformationLine />
          </NavLink>
          <NavLink href='/projects' mr='8' title='Projetos'>
            <RiCodeSSlashLine />
          </NavLink>
          <NavLink href='/resume' mr='14' title='Currículo'>
            <RiFile2Line />
          </NavLink>
        </Flex>
      )}

      {!isWideVersion && (
        <Flex flexDirection='column' justify='space-around' height='75vh'>
          <Flex
            w='100%'
            align='center'
            fontWeight='medium'
            fontSize='lg'
            flexDirection='column'
          >
            <NavLink href='/home' title='Início'>
              <RiHome2Line />
            </NavLink>
            <NavLink href='/about' mt='10' title='Sobre'>
              <RiInformationLine />
            </NavLink>
            <NavLink href='/projects' mt='10' title='Projetos'>
              <RiCodeSSlashLine />
            </NavLink>
            <NavLink href='/resume' mt='10' title='Currículo'>
              <RiFile2Line />
            </NavLink>
          </Flex>
          <Flex justify='space-evenly'>
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
          </Flex>
        </Flex>
      )}
    </>
  );
}
