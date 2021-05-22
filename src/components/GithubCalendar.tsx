import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import ReactTooltip from 'react-tooltip';
import { Flex, Text } from '@chakra-ui/react';

export function GithubCalendar() {
  return (
    <>
      <Flex flexDirection='column' mt='14'>
        <Text fontSize={{ sm: 'xl', xs: '2xl', md: '3xl' }} color='red.400'>
          Contribuições no Github
        </Text>

        <Flex
          flexDirection='column'
          mt='6'
          align='center'
        >
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
      </Flex>
    </>
  );
}
