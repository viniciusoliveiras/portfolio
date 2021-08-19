/* eslint-disable react/no-array-index-key */
import { Flex, Heading, Text } from '@chakra-ui/react';

interface ResumeItemProps {
  title: string;
  institution: string;
  period: string;
  description?: string[] | undefined;
}

export function ResumeItem({
  title,
  institution,
  period,
  description,
}: ResumeItemProps) {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      px={{ base: '8', xl: '12' }}
      className="resume-item"
    >
      <Heading
        textAlign="center"
        fontSize={{ base: 'lg', lg: 'xl', xl: '2xl' }}
        color="yellow.400"
        fontWeight="normal"
      >
        {title}
      </Heading>

      <Text mt="4">{institution}</Text>

      <Text mb="4" mt="1">
        {period}
      </Text>

      {description &&
        description.map((value, index) => (
          <Text key={index} textAlign="justify">
            {'>'} {value}
          </Text>
        ))}
    </Flex>
  );
}
