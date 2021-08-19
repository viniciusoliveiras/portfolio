import { Flex, Text, Grid } from '@chakra-ui/react';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ProjectCard } from '../components/Projects/ProjectCard';
import { WarningAlertDialog } from '../components/WarningAlertDialog';

export default function Projects() {
  return (
    <Flex
      minH="100vh"
      flexDirection="column"
      mx={{ base: '4', sm: '8', md: '14', lg: '24', xl: '32' }}
      justifyContent="space-between"
    >
      <WarningAlertDialog />

      <Header />

      <Grid
        templateColumns="repeat(3, 1fr) "
        gap={4}
        align="center"
        justify="center"
        mt={{ md: '16' }}
      >
        <ProjectCard
          imageURL="https://geocreed.sirv.com/viniciusoliveiras-portfolio/ig.news.png"
          title="ig.news"
          description="O ig.news é uma plataforma de assinatura para conteúdos em texto."
          appURL="https://ig-news-viniciusoliveiras.vercel.app/"
          repositoryURL="https://github.com/viniciusoliveiras/ig.news"
        />
      </Grid>

      <Footer />
    </Flex>
  );
}
