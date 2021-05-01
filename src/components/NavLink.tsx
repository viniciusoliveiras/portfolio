import {
  Text,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import { ActiveLink } from './ActiveLink';

interface NavLinkProps extends ChakraLinkProps {
  children: string;
  href: string;
}

export function NavLink({ children, href, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref>
      <ChakraLink
        display='flex'
        align='center'
        {...rest}
        justifyContent='center'
      >
        <Text textAlign='center'>{children}</Text>
      </ChakraLink>
    </ActiveLink>
  );
}
