import { GetServerSideProps } from 'next';

import { api } from '../services/api';

import { AboutMe } from '../components/AboutMe';
import { Header } from '../components/Header';
import { RecentProjects } from '../components/RecentProjects';
import { WarningAlertDialog } from '../components/WarningAlertDialog';
interface Repository {
  name: string;
  updated_at: string;
  description: string;
  html_url: string;
}

interface HomeProps {
  repos: Repository[];
  userBio: string;
}

export default function Home({ repos, userBio }: HomeProps) {
  return (
    <>
      <WarningAlertDialog />

      <Header />

      <AboutMe bio={userBio} />

      <RecentProjects repos={repos} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get(
    'viniciusoliveiras/repos?sort=updated&direction=desc'
  );

  const repos = data.slice(0, 2);

  const userResponse = await api.get('viniciusoliveiras');

  const userBio = userResponse.data.bio;

  return {
    props: { repos, userBio },
  };
};
