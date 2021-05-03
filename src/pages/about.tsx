import Head from 'next/head';
import { useEffect } from 'react';
import { Skeleton } from '@chakra-ui/react';

import { Header } from '../components/Header';

export default function About() {
  useEffect(() => {
    alert(
      '⚠️ Página ainda em construção. Alguns recursos podem não estar disponíveis ou otimizados. ⚠️'
    );
  }, []);

  return (
    <>
      <Head>
        <title>VO - Portfolio</title>
      </Head>

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
