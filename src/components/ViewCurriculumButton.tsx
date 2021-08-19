import { Box, Link } from '@chakra-ui/react';

export function ViewCurriculumButton() {
  return (
    <Link
      href="https://my.indeed.com/p/viniciuss-8n5573x"
      isExternal
      textDecoration="none"
      w="min"
      h="12"
      color="gray.900"
    >
      <Box
        as="button"
        bgColor="yellow.400"
        w="max"
        p="3.5"
        fontWeight="medium"
        fontSize="lg"
        borderRadius="4"
        _hover={{ transition: 0.2, filter: 'brightness(0.9)' }}
      >
        Ver Currículo
      </Box>
    </Link>
  );
}
