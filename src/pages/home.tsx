import Head from 'next/head';
import { Header } from '../components/Header';

export default function Home() {
  alert(
    '⚠️ Página ainda em construção. Alguns recursos podem não estar disponíveis ou otimizados. ⚠️'
  );
  return (
    <>
      <Head>
        <title>Vinicius Rei Delas</title>
      </Head>

      <Header />
    </>
  );
}
