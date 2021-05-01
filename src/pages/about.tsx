import { Heading } from '@chakra-ui/layout';
import Head from 'next/head';
import { Header } from '../components/Header';

export default function Home() {
  return (
    <>
      <Head>
        <title>viniciusoliveiras</title>
      </Head>

      <Header />

      <Heading>Sobre</Heading>
    </>
  );
}
