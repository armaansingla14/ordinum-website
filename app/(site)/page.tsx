import CtaBand from "@/components/sections/CtaBand";
import ExploreGrid from "@/components/sections/ExploreGrid";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import HashRedirect from "@/components/layout/HashRedirect";

export default function HomePage() {
  return (
    <>
      <HashRedirect />
      <Hero />
      <Problem />
      <ExploreGrid />
      <CtaBand />
    </>
  );
}
