import type { Metadata } from "next";
import CtaBand from "@/components/sections/CtaBand";
import NextPage from "@/components/sections/NextPage";
import PageHeader from "@/components/sections/PageHeader";
import Architecture from "@/components/sections/technology/Architecture";
import BuildStatus from "@/components/sections/technology/BuildStatus";
import DomainCards from "@/components/sections/technology/DomainCards";
import Nav2Integration from "@/components/sections/technology/Nav2Integration";
import TargetContract from "@/components/sections/technology/TargetContract";
import Workflow from "@/components/sections/technology/Workflow";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: pages.technology.meta.title,
  description: pages.technology.meta.description,
  alternates: { canonical: pages.technology.href },
};

/**
 * /technology: architecture (four tiers with per-node status), the target contract,
 * built / next / planned, how each stage works (with its limits), the first integration
 * (ROS 2 / Nav2) and the domain cards.
 */
export default function TechnologyPage() {
  return (
    <>
      <PageHeader page="technology" />
      <Architecture />
      <TargetContract />
      <BuildStatus />
      <Workflow />
      <Nav2Integration />
      <DomainCards />
      <NextPage current="technology" />
      <CtaBand />
    </>
  );
}
