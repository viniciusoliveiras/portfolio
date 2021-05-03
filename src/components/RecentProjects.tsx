import Link from 'next/link';
import { Flex, Text, Grid } from '@chakra-ui/react';
import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
interface Repository {
  name: string;
  updated_at: string;
  description: string;
}

interface RepoSliceProps {
  repos: Repository[];
}

export function RecentProjects({ repos }: RepoSliceProps) {
  return (
    <Flex
      mt='24'
      px={{ md: '16', lg: '36' }}
      flex='1'
      bgColor='#EDF7FA'
      flexDirection='column'
    >
      <Flex justify='space-between' flex='1' mt='4'>
        <Text fontSize='xl'>Recent projects</Text>
        <Link href='/projects'>
          <Text color='cyan.500'>View all</Text>
        </Link>
      </Flex>

      <Grid templateColumns='repeat(2, 1fr)' mt='4' gap={5} mb='6'>
        {repos.map((repo) => {
          return (
            <Flex
              bgColor='white'
              flexDirection='column'
              p='6'
              key={repo.name}
              justify='center'
            >
              <Text fontSize='2xl' fontWeight='bold'>
                {repo.name}
              </Text>

              <Flex my='6' flexDirection='column' fontSize='md'>
                <Text as='i'>
                  Última atualização há {''}
                  {formatDistanceToNow(new Date(repo.updated_at), {
                    locale: ptBR,
                  })}{' '}
                  atrás
                </Text>
                <Text as='i'>
                  {format(new Date(repo.updated_at), 'PP - H:m', {
                    locale: ptBR,
                  })}{' '}
                  BRL
                </Text>
              </Flex>

              <Text fontSize='lg'>{repo.description}</Text>
            </Flex>
          );
        })}
      </Grid>
    </Flex>
  );
}