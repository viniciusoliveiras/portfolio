import React from "react";
import Link from "next/link";
import {
  Flex,
  Text,
  Grid,
  Tooltip,
  useBreakpointValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { format, formatDistanceToNowStrict } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
interface Repository {
  name: string;
  updated_at: string;
  description: string;
  html_url: string;
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
          mt="12"
          px={{ md: "16", lg: "20" }}
          bgColor="gray.700"
          flexDirection="column"
          alignSelf="center"
          borderRadius="12"
          w="100%"
        >
          <Flex justify="space-between" align="center" flex="1" mt="4">
            <Text fontSize="2xl">Projetos recentes</Text>
            <Link href="/projects">
              <Text color="yellow.400">Ver todos</Text>
            </Link>
          </Flex>

          <Grid templateColumns="repeat(2, 1fr)" mt="6" gap={5} mb="6">
            {repos.map((repo) => {
              return (
                <Flex
                  p="6"
                  flexDirection="column"
                  justify="center"
                  bgColor="gray.900"
                  borderRadius="12"
                  key={repo.name}
                >
                  <Text fontSize="2xl" fontWeight="bold">
                    {repo.name}
                  </Text>

                  <Flex my="6" flexDirection="column" fontSize="md">
                    <Tooltip
                      label={`${format(new Date(repo.updated_at), "PP HH:mm", {
                        locale: ptBR,
                      })} BRL`}
                      aria-label="A tooltip"
                      placement="bottom"
                    >
                      <Text>
                        Atualizado há {""}
                        {formatDistanceToNowStrict(new Date(repo.updated_at), {
                          locale: ptBR,
                        })}{" "}
                        atrás
                      </Text>
                    </Tooltip>
                  </Flex>

                  <Text fontSize="lg">{repo.description}</Text>

                  <ChakraLink href={repo.html_url} isExternal mt="8">
                    <Text color="yellow.400">
                      Acessar <ExternalLinkIcon mx="2px" />
                    </Text>
                  </ChakraLink>
                </Flex>
              );
            })}
          </Grid>
        </Flex>
      )}

      {!isWideVersion && (
        <Flex
          mt="10"
          px="10"
          bgColor="gray.700"
          flexDirection="column"
          alignSelf="center"
          borderRadius="12"
        >
          <Flex justify="center" align="center" flex="1" mt="4">
            <Text fontSize="xl">Projetos recentes</Text>
          </Flex>

          <Grid templateColumns="repeat(1, 1fr)" mt="6" gap={5} mb="6">
            {repos.map((repo) => {
              return (
                <Flex
                  bgColor="gray.900"
                  borderRadius="12"
                  flexDirection="column"
                  p="6"
                  key={repo.name}
                  justify="center"
                >
                  <Text fontSize="xl" fontWeight="bold">
                    {repo.name}
                  </Text>

                  <Flex my="6" flexDirection="column" fontSize="sm">
                    <Tooltip
                      label={`${format(new Date(repo.updated_at), "PP HH:mm", {
                        locale: ptBR,
                      })} BRL`}
                      aria-label="A tooltip"
                      placement="bottom"
                    >
                      <Text>
                        Atualizado há {""}
                        {formatDistanceToNowStrict(new Date(repo.updated_at), {
                          locale: ptBR,
                        })}{" "}
                        atrás
                      </Text>
                    </Tooltip>
                  </Flex>

                  <Text fontSize="md">{repo.description}</Text>

                  <ChakraLink href={repo.html_url} isExternal mt="8">
                    <Text color="gray.100">
                      Acessar <ExternalLinkIcon mx="2px" />
                    </Text>
                  </ChakraLink>
                </Flex>
              );
            })}
          </Grid>
          <Flex justify="center" align="center" flex="1" mb="4">
            <Link href="/projects">
              <Text color="yellow.400">Ver todos</Text>
            </Link>
          </Flex>
        </Flex>
      )}
    </>
  );
}
