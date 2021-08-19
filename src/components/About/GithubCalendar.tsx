import GitHubCalendar from 'react-github-calendar';
import ReactTooltip from 'react-tooltip';

import { Flex, Text, useBreakpointValue } from '@chakra-ui/react';

export function GithubCalendar() {
  const isWideVersion = useBreakpointValue({
    xs: false,
    md: true,
  });

  const colorTheme = {
    background: 'transparent',
    text: '#ffffff',
    grade4: '#FFD369',
    grade3: '#ffda83e3',
    grade2: '#ffe3a0e3',
    grade1: '#fdecc4e3',
    grade0: '#fffbf0e3',
  };

  return (
    <>
      <Flex flexDirection="column" mt="14">
        <Text fontSize={{ xs: '2xl', md: '3xl' }} color="yellow.400">
          Contribuições no Github
        </Text>

        {isWideVersion && (
          <Flex flexDirection="column" mt="6" align="center">
            <GitHubCalendar
              username="viniciusoliveiras"
              blockSize={20}
              blockMargin={5}
              fontSize={18}
              theme={colorTheme}
            >
              <ReactTooltip delayShow={50} html />
            </GitHubCalendar>
          </Flex>
        )}

        {!isWideVersion && (
          <Flex flexDirection="column" mt="4" align="center">
            <GitHubCalendar
              username="viniciusoliveiras"
              theme={colorTheme}
              blockSize={30}
              blockMargin={5}
              fontSize={16}
            >
              <ReactTooltip delayShow={50} html />
            </GitHubCalendar>
          </Flex>
        )}
      </Flex>
    </>
  );
}
