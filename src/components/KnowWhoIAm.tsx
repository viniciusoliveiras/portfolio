import { Flex, Grid, Image, Text, GridItem } from '@chakra-ui/react';
import Tilt from 'react-parallax-tilt';
import { Footer } from './Footer';
import { GithubCalendar } from './GithubCalendar';
import { Tech } from './Tech';

export function KnowWhoIAm() {
  return (
    <>
      <Flex mt='14' mx={{ xs: '12', xl: '16' }} flexDirection='column'>
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

        <Grid templateColumns='repeat(2, 1fr)' gap={{ xs: 4, lg: 6, xl: 12 }}>
          <GridItem>
            <Text
              fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }}
              mt='16'
              color='red.400'
            >
              Tech Stack
            </Text>

            <Flex>
              <Grid
                templateColumns='repeat(3, 1fr)'
                mt='4'
                gap={{ xs: 4, lg: 6, xl: 12 }}
                p={{ xl: 6 }}
              >
                <Tech imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-plain.svg' />
                <Tech imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg' />
                <Tech imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' />
                <Tech imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' />
                <Tech imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' />
                <Tech imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' />
              </Grid>
            </Flex>
          </GridItem>

          <GridItem>
            <Text
              fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }}
              mt='16'
              color='red.400'
            >
              Ferramentas que utilizo
            </Text>

            <Flex>
              <Grid
                templateColumns='repeat(3, 1fr)'
                mt='4'
                gap={{ xs: 4, lg: 6, xl: 12 }}
                p={{ xl: 6 }}
              >
                <Tech imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/ubuntu/ubuntu-plain.svg' />
                <Tech imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/visualstudio/visualstudio-plain.svg' />
                <Tech imageSRC='images/vercel-icon-dark.svg' />
              </Grid>
            </Flex>
          </GridItem>
        </Grid>

        <GithubCalendar />

        <Footer />
      </Flex>
    </>
  );
}
