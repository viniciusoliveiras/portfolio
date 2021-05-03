import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AboutMe } from '../components/AboutMe';
import { Header } from '../components/Header';
import { RecentProjects } from '../components/RecentProjects';
import { api } from '../services/api';
import { GetServerSideProps } from 'next';
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
  // useEffect(() => {
  //   alert(
  //     '⚠️ Página ainda em construção. Alguns recursos podem não estar disponíveis ou otimizados. ⚠️'
  //   );
  // }, []);

  return (
    <>
      <Head>
        <title>VO - Portfólio</title>
      </Head>

      <Header />

      <AboutMe />

      <RecentProjects repos={repos} />
    </>
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
