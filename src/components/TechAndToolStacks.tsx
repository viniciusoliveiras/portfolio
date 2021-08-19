import {
  Flex,
  Grid,
  Text,
  GridItem,
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react';

import { Tech } from './Tech';

export function TechAndToolStacks() {
  const isWideVersion = useBreakpointValue({
    xs: false,
    md: true,
  });

  return (
    <>
      {isWideVersion && (
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={{ xs: 4, lg: 6, xl: 12 }}
          mt="16"
        >
          <GridItem>
            <Text fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }} color="red.400">
              Tech Stack
            </Text>

            <Flex>
              <Grid
                templateColumns="repeat(3, 1fr)"
                mt="4"
                gap={{ xs: 4, lg: 6, xl: 12 }}
                p={{ xl: 6 }}
              >
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-plain.svg"
                  techName="HTML5"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg"
                  techName="CSS3"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
                  techName="JavaScript"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"
                  techName="React"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg"
                  techName="Next.js"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg"
                  techName="TypeScript"
                />
              </Grid>
            </Flex>
          </GridItem>

          <Flex justify="center">
            <Divider orientation="vertical" borderColor="red.400" />
          </Flex>

          <GridItem>
            <Text fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }} color="red.400">
              Ferramentas que utilizo
            </Text>

            <Flex>
              <Grid
                templateColumns="repeat(3, 1fr)"
                mt="4"
                gap={{ xs: 4, lg: 6, xl: 12 }}
                p={{ xl: 6 }}
              >
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/ubuntu/ubuntu-plain.svg"
                  techName="Ubuntu"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/visualstudio/visualstudio-plain.svg"
                  techName="VS Code"
                />
                <Tech
                  imageSRC="images/vercel-icon-dark.svg"
                  techName="Vercel"
                />
              </Grid>
            </Flex>
          </GridItem>
        </Grid>
      )}

      {!isWideVersion && (
        <Grid templateColumns="repeat(1, 1fr)" gap="10" mt="10">
          <GridItem>
            <Text fontSize="2xl" color="red.400">
              Tech Stack
            </Text>

            <Flex>
              <Grid
                templateColumns="repeat(3, 1fr)"
                mt="4"
                gap={{ xs: 2, sm: 6 }}
              >
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-plain.svg"
                  techName="HTML5"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg"
                  techName="CSS3"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
                  techName="JavaScript"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"
                  techName="React"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg"
                  techName="Next.js"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg"
                  techName="TypeScript"
                />
              </Grid>
            </Flex>
          </GridItem>

          <GridItem>
            <Text fontSize="2xl" color="red.400">
              Ferramentas que utilizo
            </Text>

            <Flex>
              <Grid
                templateColumns="repeat(3, 1fr)"
                mt="4"
                gap={{ xs: 2, sm: 6 }}
              >
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/ubuntu/ubuntu-plain.svg"
                  techName="Ubuntu"
                />
                <Tech
                  imageSRC="https://raw.githubusercontent.com/devicons/devicon/master/icons/visualstudio/visualstudio-plain.svg"
                  techName="VS Code"
                />
                <Tech
                  imageSRC="images/vercel-icon-dark.svg"
                  techName="Vercel"
                />
              </Grid>
            </Flex>
          </GridItem>
        </Grid>
      )}
    </>
  );
}
