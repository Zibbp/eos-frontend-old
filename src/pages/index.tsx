import { LandingHero } from "@/components/Landing/Hero";
import { useDocumentTitle } from "@mantine/hooks";
import React from "react";

const Home = () => {
  useDocumentTitle("Home - Eos");
  return (
    <div>
      <div>
        <LandingHero />
      </div>
    </div>
  );
};

export default Home;
