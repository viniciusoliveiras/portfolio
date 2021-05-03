import React from 'react';
import Link from 'next/link';
import {
  Flex,
  Text,
  Grid,
  Tooltip,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react';
import { format, formatDistanceToNowStrict } from 'date-fns';
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
  const isWideVersion = useBreakpointValue({
    xs: false,
    sm: false,
    md: true,
  });

  return (
    <>
      {isWideVersion && (
        <Flex
          mt='24'
          px={{ md: '16', lg: '36' }}
          flex='1'
          bgColor='#EDF7FA'
          flexDirection='column'
        >
          <Flex justify='space-between' align='center' flex='1' mt='4'>
            <Text fontSize='xl'>Projetos recentes</Text>
            <Link href='/projects'>
              <Text color='cyan.500'>Ver todos</Text>
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
                    <Tooltip
                      label={`${format(new Date(repo.updated_at), 'PP HH:mm', {
                        locale: ptBR,
                      })} BRL`}
                      aria-label='A tooltip'
                      placement='bottom'
                    >
                      <Text>
                        Atualizado há {''}
                        {formatDistanceToNowStrict(new Date(repo.updated_at), {
                          locale: ptBR,
                        })}{' '}
                        atrás
                      </Text>
                    </Tooltip>
                    <Text></Text>
                  </Flex>

                  <Text fontSize='lg'>{repo.description}</Text>
                </Flex>
              );
            })}
          </Grid>
        </Flex>
      )}

      {!isWideVersion && (
        <Flex mt='16' px='10' flex='1' bgColor='#EDF7FA' flexDirection='column'>
          <Flex justify='space-between' align='center' flex='1' mt='4'>
            <Text fontSize='xl'>Projetos recentes</Text>
            <Link href='/projects'>
              <Text color='cyan.500'>Ver todos</Text>
            </Link>
          </Flex>

          <Grid templateColumns='repeat(1, 1fr)' mt='4' gap={5} mb='6'>
            {repos.map((repo) => {
              return (
                <Flex
                  bgColor='white'
                  flexDirection='column'
                  p='6'
                  key={repo.name}
                  justify='center'
                >
                  <Text fontSize='xl' fontWeight='bold'>
                    {repo.name}
                  </Text>

                  <Flex my='6' flexDirection='column' fontSize='sm'>
                    <Tooltip
                      label={`${format(new Date(repo.updated_at), 'PP HH:mm', {
                        locale: ptBR,
                      })} BRL`}
                      aria-label='A tooltip'
                      placement='bottom'
                    >
                      <Text>
                        Atualizado há {''}
                        {formatDistanceToNowStrict(new Date(repo.updated_at), {
                          locale: ptBR,
                        })}{' '}
                        atrás
                      </Text>
                    </Tooltip>
                    <Text></Text>
                  </Flex>

                  <Text fontSize='md'>{repo.description}</Text>
                </Flex>
              );
            })}
          </Grid>
        </Flex>
      )}
    </>
  );
}
