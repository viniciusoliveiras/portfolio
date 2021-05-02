import Head from 'next/head';
import { useEffect } from 'react';
import { AboutMe } from '../components/AboutMe';
import { Header } from '../components/Header';

export default function Home() {
  useEffect(() => {
    alert(
      '⚠️ Página ainda em construção. Alguns recursos podem não estar disponíveis ou otimizados. ⚠️'
    );
  }, []);

  return (
    <>
      <Head>
        <title>Vinicius Rei Delas</title>
      </Head>

      <Header />

      <AboutMe />
    </>
  );
}
