import { Flex, Grid, Heading, Box } from '@chakra-ui/react';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ResumeItem } from '../components/Resume/ResumeItem';
import { ViewCurriculumButton } from '../components/ViewCurriculumButton';

export default function Resumen() {
  return (
    <>
      <Header />
      <Flex
        // minHeight="100vh"
        flexDirection="column"
        mx={{ base: '4', sm: '8', md: '14', lg: '16', xl: '32' }}
        mt={{ base: '20', md: '14' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box my={{ base: '8', md: '12', lg: '16' }}>
          <ViewCurriculumButton />
        </Box>

        <Grid
          minHeight="60vh"
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          gap={{ base: 12, lg: 24, xl: 32 }}
        >
          <Flex flexDirection="column">
            <Heading
              textAlign="center"
              fontWeight="medium"
              fontSize={{ base: 'xl', md: '2xl', lg: '3xl', xl: '4xl' }}
            >
              Experiência profissional
            </Heading>

            <Flex borderLeft="2px solid #FFD369" flexDirection="column" mt="8">
              <ResumeItem
                title="Jovem Aprendiz"
                institution="Ancar Ivanhoe"
                period="Março 2019 a Abril 2021"
                description={[
                  'Trabalhei por 1 ano e 7 meses como jovem aprendiz em TI, auxiliando nas rotinas da área e atendendo colaboradores.',
                  'Devido a mudanças internas nos departamentos, em novembro de 2020 fui transferido para área de Marketing, onde atuei por 4 meses realizando pagamentos a fornecedores externos e auxiliando na produção e organização de campanhas de marketing do shopping.',
                ]}
              />
            </Flex>
          </Flex>

          <Flex flexDirection="column">
            <Heading
              textAlign="center"
              fontWeight="medium"
              fontSize={{ base: 'xl', md: '2xl', lg: '3xl', xl: '4xl' }}
            >
              Formação acadêmica
            </Heading>

            <Flex borderLeft="2px solid #FFD369" flexDirection="column" mt="8">
              <ResumeItem
                title="Ensino Superior em Análise e Desenvolvimento de Sistemas"
                institution="Unicarioca"
                period="Janeiro 2020 até a data atual"
              />

              <ResumeItem
                title="Programa de Aceleração para Desenvolvedores em Desenvolvimento Web - React"
                institution="Rocketseat"
                period="Março 2021 a Agosto 2021"
              />

              <ResumeItem
                title="Ensino Médio"
                institution="C. E. Olinto da Gama Botelho"
                period="Janeiro 2017 a Dezembro 2019"
              />
            </Flex>
          </Flex>
        </Grid>

        <Footer />
      </Flex>
    </>
  );
}
