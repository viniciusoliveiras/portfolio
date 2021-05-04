import {
  Box,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

export function About2() {
  return (
    <Flex
      mt='8'
      mb='8'
      px={{ md: '16', lg: '36' }}
      flex='1'
      flexDirection='column'
      justify='space-around'
    >
      <Text fontSize='2xl'>Um pouco sobre mim</Text>
      <Grid
        templateColumns='repeat(2, 1fr)'
        mt='4'
        gap={10}
        align='center'
        justify='center'
        h={{ md: '85vh', lg: '65vh', xl: '50vh' }}
      >
        <Flex
          flexDirection='column'
          justify='space-evenly'
          textAlign='left'
          fontSize='xl'
        >
          <Text>
            Desde criança sempre gostei muito de computadores e entrei no
            universo da programação na faculdade
          </Text>

          <Text>
            Utilizo bastante{' '}
            <span className='highlightText'>HTML5, CSS3 e JavaScript</span> nos
            projetos de estudo que faço
          </Text>

          <Text>
            Meu foco atual é o <span className='highlightText'>React.js</span>{' '}
            integrado com o <span className='highlightText'>Next.js</span>
          </Text>

          <Text>
            Sempre que possível, aplico tudo o que aprendo nos desafios do curso
            e em alguns projetos, como{' '}
            <span className='highlightText'>esse site,</span> por exemplo
          </Text>
        </Flex>

        <Flex align='center' justify='center'>
          <Image src='images/avatar.svg' boxSize='350' />
        </Flex>
      </Grid>
    </Flex>
  );
}
