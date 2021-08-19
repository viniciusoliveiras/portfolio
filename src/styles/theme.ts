import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const breakpoints = createBreakpoints({
  xs: '20em',
  sm: '26.5625em',
  md: '48em',
  lg: '64em',
  xl: '90em',
});

export const theme = extendTheme({
  colors: {
    red: {
      '400': '#FF6464' /* primary */,
    },
    cyan: {
      '500': '#00A8CC' /* secondary */,
    },
    yellow: {
      '400': '#FFD369',
    },
    gray: {
      '100': '#EEEEEE',
      '400': '#8695A4',
      '700': '#393E46',
      '900': '#222831',
    },
  },
  fonts: {
    heading: 'Heebo',
    body: 'Heebo',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'gray.100',
      },
    },
  },
  breakpoints,
});
