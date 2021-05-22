import { GetServerSideProps } from 'next';
import React from 'react';

import { Header } from '../components/Header';
import { KnowWhoIAm } from '../components/KnowWhoIAm';
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
