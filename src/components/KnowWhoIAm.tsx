import { Flex, Grid, Image, Text, GridItem, Divider } from '@chakra-ui/react';
import React from 'react';
import Tilt from 'react-parallax-tilt';
import { Footer } from './Footer';
import { GithubCalendar } from './GithubCalendar';
import { Tech } from './Tech';

type KnowWhoIAmProps = {
  bio: string;
};

export function KnowWhoIAm({ bio }: KnowWhoIAmProps) {
  return (
    <>
      <Flex
        mt={{ sm: 2, lg: 14 }}
        mx={{ xs: '12', xl: '16' }}
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
              Olá, eu sou o Vinícius, sou do Rio de Janeiro, Brasil. {bio}.
              Utilizo bastante{' '}
              <span className='highlightText'>HTML5, CSS3 e JavaScript</span>{' '}
              nos projetos de estudo que faço. Meu foco atual é o{' '}
              <span className='highlightText'>React.js</span> integrado com o{' '}
              <span className='highlightText'>Next.js</span>
            </Text>
          </Flex>
        </Flex>

        <Grid
          templateColumns='repeat(3, 1fr)'
          gap={{ xs: 4, lg: 6, xl: 12 }}
          mt='16'
        >
          <GridItem>
            <Text fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }} color='red.400'>
              Tech Stack
            </Text>

            <Flex>
              <Grid
                templateColumns='repeat(3, 1fr)'
                mt='4'
                gap={{ xs: 4, lg: 6, xl: 12 }}
                p={{ xl: 6 }}
              >
                <Tech
                  imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-plain.svg'
                  techName='HTML5'
                />
                <Tech
                  imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg'
                  techName='CSS3'
                />
                <Tech
                  imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg'
                  techName='JavaScript'
                />
                <Tech
                  imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg'
                  techName='React'
                />
                <Tech
                  imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg'
                  techName='Next.js'
                />
                <Tech
                  imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg'
                  techName='TypeScript'
                />
              </Grid>
            </Flex>
          </GridItem>

          <Flex justify='center'>
            <Divider orientation='vertical' borderColor='red.400' />
          </Flex>

          <GridItem>
            <Text fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }} color='red.400'>
              Ferramentas que utilizo
            </Text>

            <Flex>
              <Grid
                templateColumns='repeat(3, 1fr)'
                mt='4'
                gap={{ xs: 4, lg: 6, xl: 12 }}
                p={{ xl: 6 }}
              >
                <Tech
                  imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/ubuntu/ubuntu-plain.svg'
                  techName='Ubuntu'
                />
                <Tech
                  imageSRC='https://raw.githubusercontent.com/devicons/devicon/master/icons/visualstudio/visualstudio-plain.svg'
                  techName='VS Code'
                />
                <Tech
                  imageSRC='images/vercel-icon-dark.svg'
                  techName='Vercel'
                />
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
