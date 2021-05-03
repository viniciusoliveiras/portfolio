import Head from 'next/head';
import { useEffect } from 'react';
import { Skeleton } from '@chakra-ui/react';

import { Header } from '../components/Header';
import { WarningAlertDialog } from '../components/WarningAlertDialog';

export default function About() {
  return (
    <>
      <Head>
        <title>VO - Portfolio</title>
      </Head>

      <WarningAlertDialog />

      <Header />

      <Skeleton height='4rem' mx='auto' mt='10' w='90%' />
      <Skeleton height='4rem' mx='auto' mt='4' w='90%' />
      <Skeleton height='4rem' mx='auto' mt='4' w='90%' />
      <Skeleton height='4rem' mx='auto' mt='4' w='90%' />
      <Skeleton height='4rem' mx='auto' mt='4' w='90%' />
      <Skeleton height='4rem' mx='auto' mt='4' w='90%' />
    </>
  );
}
