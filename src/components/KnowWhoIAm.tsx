import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import Tilt from 'react-parallax-tilt';

export function KnowWhoIAm() {
  return (
    <>
      <Flex
        mt='14'
        mx={{ xs: '10', sm: '10', md: '10', lg: '16', xl: '32' }}
        flexDirection='column'
      >
        <Flex align='center' justify='space-around' flex='1'>
          <Flex>
            <Tilt>
              <Image src='images/avatar.svg' boxSize='350' />
            </Tilt>
          </Flex>

          <Flex flexDirection='column' ml='4'>
            <Text fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }} color='red.400'>
              Saiba quem sou eu
            </Text>
            <Text
              mt='10'
              flexDirection='column'
              justify='center'
              textAlign='left'
              fontSize='xl'
              w='60vw'
            >
              Olá, eu sou o Vinícius, sou do Rio de Janeiro, Brasil. Estou
              cursando o 3º período de Análise e Desenvolvimento de Sistemas na
              Unicarioca. Utilizo bastante{' '}
              <span className='highlightText'>HTML5, CSS3 e JavaScript</span>{' '}
              nos projetos de estudo que faço. Meu foco atual é o{' '}
              <span className='highlightText'>React.js</span> integrado com o{' '}
              <span className='highlightText'>Next.js</span>
            </Text>
          </Flex>
        </Flex>

        <Text
          fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }}
          mt='16'
          color='red.400'
        >
          Tecnologias que utilizo
        </Text>

        <Flex justify='center'>
          <Grid
            templateColumns='repeat(5, 1fr)'
            w='100%'
            mt='4'
            gap={{ xs: 4, lg: 6, xl: 8 }}
            align='center'
            justify='center'
            p='6'
          >
            <Box
              border='2px solid #FF6464'
              borderRadius='12'
              boxSize={{ xs: 24, lg: 32, xl: 40 }}
              p='6'
              bgColor='white'
            >
              <Image src='https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-plain.svg' />
            </Box>

            <Box
              border='2px solid #FF6464'
              borderRadius='12'
              boxSize={{ xs: 24, lg: 32, xl: 40 }}
              p='6'
              bgColor='white'
            >
              <Image src='https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg' />
            </Box>

            <Box
              border='2px solid #FF6464'
              borderRadius='12'
              boxSize={{ xs: 24, lg: 32, xl: 40 }}
              p='6'
              bgColor='white'
            >
              <Image src='https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' />
            </Box>

            <Box
              border='2px solid #FF6464'
              borderRadius='12'
              boxSize={{ xs: 24, lg: 32, xl: 40 }}
              p='6'
              bgColor='white'
            >
              <Image src='https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' />
            </Box>

            <Box
              border='2px solid #FF6464'
              borderRadius='12'
              boxSize={{ xs: 24, lg: 32, xl: 40 }}
              p='6'
              bgColor='white'
            >
              <Image src='https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' />
            </Box>
          </Grid>
        </Flex>
      </Flex>
    </>
  );
}
