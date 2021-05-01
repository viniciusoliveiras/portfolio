import Head from 'next/head';
import { Heading } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/react';

import { Header } from '../components/Header';

export default function Home() {
  return (
    <>
      <Head>
        <title>Vinicius Rei Delas</title>
      </Head>

      <Header />

      <Skeleton height='20px' mx='auto' mt='10' w='90%' />
      <Skeleton height='20px' mx='auto' mt='4' w='90%' />
      <Skeleton height='20px' mx='auto' mt='4' w='90%' />
      <Skeleton height='20px' mx='auto' mt='4' w='90%' />
      <Skeleton height='20px' mx='auto' mt='4' w='90%' />
      <Skeleton height='20px' mx='auto' mt='4' w='90%' />
      <Skeleton height='20px' mx='auto' mt='4' w='90%' />
      <Skeleton height='20px' mx='auto' mt='4' w='90%' />
    </>
  );
}
