import { GetServerSideProps } from 'next';

import { GithubCalendar } from '../components/About/GithubCalendar';
import { KnowWhoIAm } from '../components/About/KnowWhoIAm';
import { TechAndToolStacks } from '../components/About/TechAndToolStacks';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { WarningAlertDialog } from '../components/WarningAlertDialog';
import { api } from '../services/api';

interface AboutProps {
  userBio: string;
}

export default function About({ userBio }: AboutProps) {
  return (
    <>
      <WarningAlertDialog />

      <Header />

      <KnowWhoIAm bio={userBio} />

      <TechAndToolStacks />

      <GithubCalendar />

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('viniciusoliveiras');

  const userBio = data.bio;

  return {
    props: { userBio },
  };
};
