import { Box, Link } from "@chakra-ui/react";

export function DownloadResumeButton() {
  return (
    <Link
      href="https://drive.google.com/file/d/1Dvy_sokJymNN5AaTF3Doy4biK6Fp-fXW/view?usp=sharing"
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
        _hover={{ transition: 0.2, filter: "brightness(0.9)" }}
      >
        Baixar Currículo
      </Box>
    </Link>
  );
}
