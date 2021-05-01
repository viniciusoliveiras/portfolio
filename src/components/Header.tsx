import React from 'react';
import { Flex, Grid } from '@chakra-ui/react';
import { NavLink } from './NavLink';

export function Header() {
  return (
    <Flex
      as='header'
      w='100%'
      align='center'
      mt='6'
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
  );
}
