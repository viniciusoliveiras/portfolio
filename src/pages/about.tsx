import React from 'react';

import { Header } from '../components/Header';
import { KnowWhoIAm } from '../components/KnowWhoIAm';
import { WarningAlertDialog } from '../components/WarningAlertDialog';

export default function About() {
  return (
    <>
      <WarningAlertDialog />

      <Header />

      <KnowWhoIAm />
    </>
  );
}
