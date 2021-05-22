import React from 'react';
import { Flex, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import Tilt from 'react-parallax-tilt';

import { Footer } from './Footer';
import { GithubCalendar } from './GithubCalendar';
import { TechAndToolStacks } from './TechAndToolStacks';

type KnowWhoIAmProps = {
  bio: string;
};

export function KnowWhoIAm({ bio }: KnowWhoIAmProps) {
  const isWideVersion = useBreakpointValue({
    xs: false,
    md: true,
  });

  return (
    <>
      {isWideVersion && (
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
              <Text
                fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }}
                color='red.400'
              >
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

          <TechAndToolStacks />

          <GithubCalendar />

          <Footer />
        </Flex>
      )}

      {!isWideVersion && (
        <Flex mt='10' mx='8' flexDirection='column'>
          <Text fontSize='2xl' color='red.400'>
            Saiba quem sou eu
          </Text>

          <Flex flexDirection='column' align='center'>
            <Flex mt='6'>
              <Tilt>
                <Image
                  src='images/avatar.svg'
                  boxSize={{ xs: '200', sm: '250' }}
                />
              </Tilt>
            </Flex>

            <Text
              mt='10'
              flexDirection='column'
              justify='center'
              textAlign='left'
              fontSize='lg'
            >
              Olá, eu sou o Vinícius, sou do Rio de Janeiro, Brasil. {bio}.
              Utilizo bastante{' '}
              <span className='highlightText'>HTML5, CSS3 e JavaScript</span>{' '}
              nos projetos de estudo que faço. Meu foco atual é o{' '}
              <span className='highlightText'>React.js</span> integrado com o{' '}
              <span className='highlightText'>Next.js</span>
            </Text>
          </Flex>

          <TechAndToolStacks />

          {/* <GithubCalendar /> */}

          <Footer />
        </Flex>
      )}
    </>
  );
}
