import { Flex } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';

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
    <Flex
      flexDirection="column"
      mx={{ base: '4', sm: '8', md: '14', lg: '24', xl: '32' }}
      justifyContent="space-between"
    >
      <Header />

      <KnowWhoIAm bio={userBio} />

      <TechAndToolStacks />

      <GithubCalendar />

      <Footer />
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('viniciusoliveiras');

  const userBio = data.bio;

  return {
    props: { userBio },
  };
};
