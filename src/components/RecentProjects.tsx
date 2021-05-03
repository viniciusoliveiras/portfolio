import Link from 'next/link';
import { Flex, Text, Grid } from '@chakra-ui/react';

export function RecentProjects() {
  return (
    <Flex mt='24' px='36' flex='1' bgColor='#EDF7FA' flexDirection='column' >
      <Flex justify='space-between' flex='1' mt='4'>
        <Text fontSize='xl'>Recent projects</Text>
        <Link href='/projects'>
          <Text color='cyan.500'>View all</Text>
        </Link>
      </Flex>

      <Grid templateColumns='repeat(2, 1fr)' mt='4' gap={5} mb='6'>
        <Flex bgColor='white' flexDirection='column' p='6'>
          <Text fontSize='2xl' fontWeight='bold'>
            portfolio
          </Text>

          <Flex my='4' flexDirection='column'>
            <Text as='i'>Last update</Text>
            <Text as='i'>2 de mai. de 2021 - 14:24 BRT</Text>
          </Flex>

          <Text>Personal website builded with React.js</Text>
        </Flex>

        <Flex bgColor='white' flexDirection='column' p='6'>
          <Text fontSize='2xl' fontWeight='bold'>
            uni-TI
          </Text>

          <Flex my='4' flexDirection='column'>
            <Text as='i'>Last update</Text>
            <Text as='i'>30 de abr. de 2021 - 21:18 BRT</Text>
          </Flex>

          <Text>
            Repositório para armazenamento e colaboração de atividades dos
            cursos de TI da Unicarioca.
          </Text>
        </Flex>
      </Grid>
    </Flex>
  );
}
