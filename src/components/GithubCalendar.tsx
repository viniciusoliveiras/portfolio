import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import ReactTooltip from 'react-tooltip';
import { Flex, Text, useBreakpointValue } from '@chakra-ui/react';

export function GithubCalendar() {
  const isWideVersion = useBreakpointValue({
    xs: false,
    md: true,
  });

  return (
    <>
      <Flex flexDirection='column' mt='14'>
        <Text fontSize={{ xs: '2xl', md: '3xl' }} color='red.400'>
          Contribuições no Github
        </Text>

        {isWideVersion && (
          <Flex flexDirection='column' mt='6' align='center'>
            <GitHubCalendar
              username='viniciusoliveiras'
              color='#00A8CC' //  #FF6464
              blockSize={20}
              blockMargin={5}
              fontSize={18}
            >
              <ReactTooltip delayShow={50} html />
            </GitHubCalendar>
          </Flex>
        )}

        {!isWideVersion && (
          <Flex flexDirection='column' mt='4' align='center'>
            <GitHubCalendar
              username='viniciusoliveiras'
              color='#00A8CC' //  #FF6464
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
