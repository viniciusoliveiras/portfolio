import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Flex, Image, Text, Box, Grid, Link } from '@chakra-ui/react';

interface ProjectCardProps {
  imageURL: string;
  title: string;
  description: string;
  appURL?: string;
  repositoryURL: string;
}

export function ProjectCard({
  imageURL,
  title,
  description,
  appURL,
  repositoryURL,
}: ProjectCardProps) {
  return (
    <Flex
      flex="1"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      w="100%"
      height={{ base: 'sm', md: 'lg', lg: 'xl' }}
      backgroundColor="gray.700"
      borderRadius="14"
      px="4"
    >
      <Image src={imageURL} borderRadius="12" />

      <Text fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}>{title}</Text>

      <Text fontSize={{ base: 'sm', md: 'lg', lg: 'xl' }}>{description}</Text>

      {appURL ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Link href={appURL} isExternal textDecoration="none">
            <Box
              as="button"
              bgColor="yellow.400"
              color="gray.900"
              w="max"
              p="2"
              fontWeight="medium"
              fontSize={{ base: 'sm', lg: 'md', xl: 'lg' }}
              borderRadius="4"
              _hover={{ transition: 0.2, filter: 'brightness(0.9)' }}
            >
              Aplicação <ExternalLinkIcon mx="2px" />
            </Box>
          </Link>

          <Link href={repositoryURL} isExternal textDecoration="none">
            <Box
              as="button"
              bgColor="yellow.400"
              color="gray.900"
              w="max"
              p="2"
              fontWeight="medium"
              fontSize={{ base: 'sm', lg: 'md', xl: 'lg' }}
              borderRadius="4"
              _hover={{ transition: 0.2, filter: 'brightness(0.9)' }}
            >
              Projeto <ExternalLinkIcon mx="2px" />
            </Box>
          </Link>
        </Grid>
      ) : (
        <Link href={repositoryURL} isExternal textDecoration="none">
          <Box
            as="button"
            bgColor="yellow.400"
            color="gray.900"
            w="max"
            p="2"
            fontWeight="medium"
            fontSize={{ base: 'sm', lg: 'md', xl: 'lg' }}
            borderRadius="4"
            _hover={{ transition: 0.2, filter: 'brightness(0.9)' }}
          >
            Projeto <ExternalLinkIcon mx="2px" />
          </Box>
        </Link>
      )}
    </Flex>
  );
}
