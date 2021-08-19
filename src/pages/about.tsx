import { Flex } from '@chakra-ui/react';
import { GetStaticProps } from 'next';

import { GithubCalendar } from '../components/About/GithubCalendar';
import { KnowWhoIAm } from '../components/About/KnowWhoIAm';
import { TechAndToolStacks } from '../components/About/TechAndToolStacks';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { api } from '../services/api';

interface AboutProps {
  userBio: string;
}

export default function About({ userBio }: AboutProps) {
  return (
    <>
      <Header />
      <Flex
        flexDirection="column"
        mx={{ base: '4', sm: '8', md: '14', lg: '16', xl: '32' }}
        mt="14"
        justifyContent="space-between"
      >
        <KnowWhoIAm bio={userBio} />

        <TechAndToolStacks />

        <GithubCalendar />

        <Footer />
      </Flex>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('viniciusoliveiras');

  const userBio = data.bio;

  return {
    props: { userBio },
    revalidate: 604800, //  1 week
  };
};
