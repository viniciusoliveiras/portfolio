import { Flex, Grid } from '@chakra-ui/react';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ProjectCard } from '../components/Projects/ProjectCard';

export default function Projects() {
  return (
    <>
      <Header />
      <Flex
        minH="100vh"
        flexDirection="column"
        mx={{ base: '4', sm: '8', md: '14', lg: '16', xl: '32' }}
        mt={{ base: '16', md: '14' }}
        justifyContent="space-between"
      >
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={4}
          align="center"
          justify="center"
          mt={{ base: '8', md: '12', lg: '16' }}
        >
          <ProjectCard
            imageURL="https://geocreed.sirv.com/viniciusoliveiras-portfolio/shape.it.png"
            title="shape.it"
            description="O shape.it é uma aplicação para criar e salvar treinos de musculação."
            appURL="https://shape-it-preview.vercel.app/"
            repositoryURL="https://github.com/viniciusoliveiras/shape.it"
          />

          <ProjectCard
            imageURL="https://geocreed.sirv.com/viniciusoliveiras-portfolio/ig.news.png"
            title="ig.news"
            description="O ig.news é uma plataforma de assinatura para conteúdos em texto."
            appURL="https://ig-news-viniciusoliveiras.vercel.app/"
            repositoryURL="https://github.com/viniciusoliveiras/ig.news"
          />

          <ProjectCard
            imageURL="https://geocreed.sirv.com/viniciusoliveiras-portfolio/spacetraveling.png"
            title="spacetraveling"
            description="Blog construído com React.js que utiliza o CMS Prismic para criação, listagem e exibição dos posts."
            repositoryURL="https://github.com/viniciusoliveiras/spacetraveling"
          />

          <ProjectCard
            imageURL="https://geocreed.sirv.com/viniciusoliveiras-portfolio/review.it.png"
            title="review.it"
            description="Aplicação para solicitação e envio de code review para devs."
            appURL="https://review-it-seven.vercel.app/"
            repositoryURL="https://github.com/viniciusoliveiras/review.it-frontend"
          />

          <ProjectCard
            imageURL="https://geocreed.sirv.com/viniciusoliveiras-portfolio/letmeask.png"
            title="letmeask"
            description="Aplicação para Q&A com a possibilidade de votação em perguntas, para que as mais votadas tenham prioridade de resposta."
            appURL="https://letmeask-978ba.web.app/"
            repositoryURL="https://github.com/viniciusoliveiras/NLW-6"
          />

          <ProjectCard
            imageURL="https://geocreed.sirv.com/viniciusoliveiras-portfolio/worldtrip.png"
            title="worldtrip"
            description="App para planejar viagens e conhecer possíveis destinos."
            appURL="https://worldtrip-viniciusoliveiras.vercel.app/"
            repositoryURL="https://github.com/viniciusoliveiras/worldtrip"
          />
        </Grid>

        <Footer />
      </Flex>
    </>
  );
}
