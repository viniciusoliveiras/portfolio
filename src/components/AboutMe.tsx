import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import { DownloadResumeButton } from "./DownloadResumeButton";
import { Typer } from "./Typer";
import Typewriter from "typewriter-effect";

interface AboutMeProps {
  bio: string;
}

export function AboutMe({ bio }: AboutMeProps) {
  const isWideVersion = useBreakpointValue({
    xs: false,
    sm: false,
    md: true,
  });

  return (
    <>
      {isWideVersion && (
        <Grid
          templateColumns="repeat(2, 1fr)"
          mt={{ md: "20" }}
          gap={16}
          align="center"
          justify="center"
        >
          <Flex flexDirection="column" align="left" justify="space-around">
            <Text
              fontSize={{ md: "3xl", lg: "4xl", xl: "5xl" }}
              fontWeight="bold"
              textAlign="left"
              w="100%"
              as="span"
            >
              Olá, eu sou Vinícius,
              <Typer />
            </Text>

            <DownloadResumeButton />
          </Flex>
          <Flex flexDirection="column" align="center" justify="center">
            <Image
              src="https://avatars.githubusercontent.com/u/64497059?v=4"
              borderRadius="full"
              boxSize={{ md: "270", lg: "270", xl: "320" }}
            />
          </Flex>
        </Grid>
      )}

      {!isWideVersion && (
        <Grid mt="8" px="2" gap={16} align="center" justify="center">
          <Box flexDirection="column">
            <Image
              src="https://avatars.githubusercontent.com/u/64497059?v=4"
              borderRadius="full"
              boxSize={{ xs: "200", sm: "250" }}
            />
          </Box>

          <Box flexDirection="column">
            <Text fontSize="3xl" fontWeight="bold" w="100%" as="span">
              Olá, eu sou Vinícius,
              <Typer />
            </Text>
          </Box>

          <Box flexDirection="column">
            <DownloadResumeButton />
          </Box>
        </Grid>
      )}
    </>
  );
}
