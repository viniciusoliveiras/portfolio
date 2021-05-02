import React from 'react';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { NavLink } from './NavLink';

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
      )}
    </>
  );
}
