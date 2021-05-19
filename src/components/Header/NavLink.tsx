import {
  Text,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { ActiveLink } from '../ActiveLink';

interface NavLinkProps extends ChakraLinkProps {
  children?: ReactNode;
  title: string;
  href: string;
}

export function NavLink({ children, title, href, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref>
      <ChakraLink
        display='flex'
        alignItems='center'
        justifyContent='center'
        {...rest}
      >
        {children}
        <Text ml='2'>{title}</Text>
      </ChakraLink>
    </ActiveLink>
  );
}
