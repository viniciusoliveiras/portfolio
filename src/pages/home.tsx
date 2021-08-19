import { Flex } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { AboutMe } from '../components/Home/AboutMe';
import { RecentProjects } from '../components/Home/RecentProjects';
import { api } from '../services/api';

interface Repository {
  name: string;
  updated_at: string;
  description: string;
  html_url: string;
}

interface HomeProps {
  repos: Repository[];
}

export default function Home({ repos }: HomeProps) {
  return (
    <Flex
      height="100vh"
      flexDirection="column"
      mx={{ base: '4', sm: '8', md: '14', lg: '16', xl: '32' }}
      justifyContent="space-between"
    >
      <Header />

      <AboutMe />

      <RecentProjects repos={repos} />

      <Footer />
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get(
    'viniciusoliveiras/repos?sort=updated&direction=desc'
  );

  const repos = data.slice(0, 2);

  return {
    props: { repos },
  };
};
