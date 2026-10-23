import EngineeringStatus from "./research/EngineeringStatus";
import Nav2Pilot from "./research/Nav2Pilot";
import NotProven from "./research/NotProven";
import ResearchRoadmap from "./research/ResearchRoadmap";
import ToyBenchmark from "./research/ToyBenchmark";
import TraceDemo from "./research/TraceDemo";
import WithdrawnNote from "./research/WithdrawnNote";

/**
 * /research body (BRIEF section 7): A status, B toy benchmark, C Nav2 pilot, D real trace,
 * E what we have not proven, F roadmap, then the withdrawn-v1 history note.
 * Copy from lib/content.ts (research.*); numbers and traces from lib/evidence.ts.
 */
export default function Research() {
  return (
    <>
      <EngineeringStatus />
      <ToyBenchmark />
      <Nav2Pilot />
      <TraceDemo />
      <NotProven />
      <ResearchRoadmap />
      <WithdrawnNote />
    </>
  );
}
