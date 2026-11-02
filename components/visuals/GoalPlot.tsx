import { SourceLine } from "@/components/sections/demo/parts";
import { cn } from "@/lib/cn";
import { nav2SuccessMismatch as sm } from "@/lib/evidence";

/*
 * Goal-position plot for the Nav2 success-mismatch run, drawn only from lib/evidence.ts:
 * the simulator's ground-truth path (minimized run, sampled every 0.5 s), the task's start and
 * goal, the 0.35 m success radius, and the robot's true position when Nav2 reported SUCCEEDED
 * (11.61 s, 0.80 m from the goal). Map frame, metres; y up.
 */

const SUCCESS_RADIUS_M = 0.35;
const X0 = 1.5;
const X1 = 6.5;
const Y0 = 2.0;
const Y1 = 6.0;
const S = 80; // px per metre
const M = 24; // margin
const W = (X1 - X0) * S + 2 * M;
const H = (Y1 - Y0) * S + 2 * M;

const px = (x: number) => M + (x - X0) * S;
const py = (y: number) => M + (Y1 - y) * S;

const path = sm.minimized.truthPath;
const [sx, sy] = sm.task.start;
const [gx, gy] = sm.task.goal;
const tReport = sm.verdict.tS;

/** True position at the moment Nav2 reported success, interpolated between the two recorded samples around it. */
function poseAt(t: number): [number, number] {
  for (let i = 1; i < path.length; i++) {
    const [t1, x1, y1] = path[i];
    if (t1 >= t) {
      const [t0, x0, y0] = path[i - 1];
      const f = (t - t0) / (t1 - t0);
      return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f];
    }
  }
  const last = path[path.length - 1];
  return [last[1], last[2]];
}
const [rx, ry] = poseAt(tReport);

const mono = "font-mono text-[10.5px] leading-[1.4] tracking-[0.1em] uppercase";

export default function GoalPlot({ className }: { className?: string }) {
  const label = `Plot of the recorded simulation trace. The robot starts at (${sx}, ${sy}) and drives toward the goal at (${gx}, ${gy}). Success counts only within ${SUCCESS_RADIUS_M} m of the goal. When Nav2 reported ${sm.minimized.result.status} at ${tReport} s, the robot's true position was ${sm.verdict.distanceText} from the goal, outside the success radius. A harness artifact, not a Nav2 bug.`;
  return (
    <figure className={cn("border border-line-2 bg-window", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className={cn(mono, "text-[#a5b1ad]")}>Goal position, true path</p>
        <p className={cn(mono, "text-lime")}>Recorded simulation trace · harness artifact, not a Nav2 bug</p>
      </div>
      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-auto w-full max-w-[560px]">
          {/* 1 m grid */}
          {Array.from({ length: X1 - X0 + 1 }, (_, i) => X0 + i).map((x) => (
            <line key={`x${x}`} x1={px(x)} x2={px(x)} y1={py(Y0)} y2={py(Y1)} className="stroke-line" strokeWidth="1" />
          ))}
          {Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i).map((y) => (
            <line key={`y${y}`} x1={px(X0)} x2={px(X1)} y1={py(y)} y2={py(y)} className="stroke-line" strokeWidth="1" />
          ))}
          {/* Goal and the 0.35 m success radius */}
          <circle cx={px(gx)} cy={py(gy)} r={SUCCESS_RADIUS_M * S} className="fill-lime/10 stroke-lime" strokeWidth="1.5" strokeDasharray="5 4" />
          <path d={`M${px(gx) - 6} ${py(gy)}h12M${px(gx)} ${py(gy) - 6}v12`} className="stroke-lime" strokeWidth="1.8" />
          {/* Start */}
          <rect x={px(sx) - 5} y={py(sy) - 5} width="10" height="10" className="fill-none stroke-text" strokeWidth="1.5" />
          {/* True path (ground truth) */}
          <polyline
            points={path.map(([, x, y]) => `${px(x)},${py(y)}`).join(" ")}
            fill="none"
            className="stroke-text"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Distance from the goal at the success report */}
          <line x1={px(rx)} y1={py(ry)} x2={px(gx)} y2={py(gy)} className="stroke-orange" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx={px(rx)} cy={py(ry)} r="7" className="fill-orange" />
          <text x={px(rx) + 14} y={py(ry) + 26} className="fill-orange font-mono" fontSize="14">
            {sm.minimized.result.status} {tReport.toFixed(2)} s
          </text>
          <text x={px(gx) - 4} y={py(gy) + SUCCESS_RADIUS_M * S + 18} textAnchor="middle" className="fill-lime font-mono" fontSize="13">
            goal ±{SUCCESS_RADIUS_M} m
          </text>
          <text x={px(sx) - 10} y={py(sy) + 4} textAnchor="end" className="fill-muted font-mono" fontSize="13">
            start
          </text>
        </svg>
        <ul className="grid gap-3 text-[14px] leading-[1.5]">
          <li className="flex items-start gap-3">
            <span className="mt-[3px] size-3 shrink-0 rounded-full border border-dashed border-lime bg-lime/10" aria-hidden="true" />
            <span className="text-muted">
              <span className="text-text">Goal</span>, with the {SUCCESS_RADIUS_M} m radius inside which success counts.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-[9px] h-[2px] w-3 shrink-0 bg-text" aria-hidden="true" />
            <span className="text-muted">
              <span className="text-text">True path</span> from the simulator, recorded by the harness.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-[3px] size-3 shrink-0 rounded-full bg-orange" aria-hidden="true" />
            <span className="text-muted">
              <span className="text-text">
                Nav2 reports {sm.minimized.result.status} at {tReport.toFixed(2)} s
              </span>
              , while the robot is {sm.verdict.distanceText} from the goal.
            </span>
          </li>
          <li>
            <SourceLine className="mt-2">{sm.traceSources[1]}</SourceLine>
          </li>
        </ul>
      </div>
    </figure>
  );
}
