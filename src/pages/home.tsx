import React from "react";
import { api } from "../services/api";
import { GetServerSideProps } from "next";
import { Flex } from "@chakra-ui/react";
import { AboutMe } from "../components/AboutMe";
import { Header } from "../components/Header";
import { RecentProjects } from "../components/RecentProjects";
import { Footer } from "../components/Footer";

interface Repository {
  name: string;
  updated_at: string;
  description: string;
  html_url: string;
}

interface HomeProps {
  repos: Repository[];
  userBio: string;
}

export default function Home({ repos, userBio }: HomeProps) {
  return (
    <Flex
      height="100vh"
      flexDirection="column"
      mx={{ base: "4", sm: "8", md: "14", lg: "24", xl: "32" }}
      justifyContent="space-between"
    >
      <Header />

      <AboutMe bio={userBio} />

      <RecentProjects repos={repos} />

      <Footer />
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get(
    "viniciusoliveiras/repos?sort=updated&direction=desc"
  );

  const repos = data.slice(0, 2);

  const userResponse = await api.get("viniciusoliveiras");

  const userBio = userResponse.data.bio;

  return {
    props: { repos, userBio },
  };
};
