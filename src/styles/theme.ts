import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    red: {
      '400': '#FF6464' /* primary */,
    },
    cyan: {
      '500': '#00A8CC' /* secondary */,
    },
    gray: {
      '400': '#8695A4' /* light */,
      '700': '#21243D' /* dark */,
    },
  },
  fonts: {
    heading: 'Heebo',
    body: 'Heebo',
  },
  styles: {
    global: {
      body: {
        bg: '#E5E5E5',
        color: 'gray.700',
      },
    },
  },
});
