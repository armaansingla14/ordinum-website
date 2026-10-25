import CrossSystem from "./research/CrossSystem";
import Limitations from "./research/Limitations";
import Methodology from "./research/Methodology";
import Mqtt from "./research/Mqtt";
import Nav2Pilot from "./research/Nav2Pilot";
import Reproducibility from "./research/Reproducibility";
import Summary from "./research/Summary";
import ToyBenchmark from "./research/ToyBenchmark";

/**
 * /research body (BRIEF section 6): executive summary first, then one section per experiment,
 * limitations, reproducibility, and methodology (with the withdrawn-v1 note) last.
 * Copy from lib/content.ts (research.*); numbers from lib/evidence.ts. Every result carries an
 * evidence label. The real trace is on /demo only, so this page renders no heavy client visual.
 */
export default function Research() {
  return (
    <>
      <Summary />
      <Nav2Pilot />
      <ToyBenchmark />
      <CrossSystem />
      <Mqtt />
      <Limitations />
      <Reproducibility />
      <Methodology />
    </>
  );
}
