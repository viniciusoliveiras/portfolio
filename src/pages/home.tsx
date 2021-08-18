import React from "react";
import { GetServerSideProps } from "next";
import { Flex } from "@chakra-ui/react";

import { api } from "../services/api";

import { AboutMe } from "../components/AboutMe";
import { AboutMe2 } from "../components/AboutMe2";
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
      mx={{ md: "14", lg: "24", xl: "32" }}
    >
      <Header />

      <AboutMe bio={userBio} />

      <RecentProjects repos={repos} />

      {/* <AboutMe2 /> */}

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
