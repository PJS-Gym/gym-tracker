import { formatDayMonth, formatNumber } from "@/lib/format";

type Point = { workout_date: string; e1rm: number };

const WIDTH = 320;
const HEIGHT = 140;
const PAD = { top: 16, right: 12, bottom: 24, left: 12 };

/**
 * The best e1RM of each workout over time, on the dark progress panel. Workouts are evenly spaced
 * so a long gap does not squash recent progress; the latest point is the pink focal mark with its
 * value written next to it. The scale hugs the data (a strength line, not a bar), and the first
 * and last dates sit under the axis. A hidden table carries every value.
 */
export function ProgressChart({ points }: { points: Point[] }) {
  const values = points.map((p) => p.e1rm);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || max * 0.1 || 1;
  const low = min - span * 0.15;
  const high = max + span * 0.15;
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v: number) => PAD.top + (1 - (v - low) / (high - low)) * innerH;
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.e1rm).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${PAD.top + innerH} L${x(0).toFixed(1)},${PAD.top + innerH} Z`;
  const last = points.length - 1;
  const bestIndex = values.indexOf(max);

  return (
    <figure className="m-0 grid gap-2">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="e1rm-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--data-1)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--data-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} stroke="var(--border-subtle)" />
        <path d={area} fill="url(#e1rm-area)" className="chart-fade" />
        <path
          d={line}
          pathLength={1}
          fill="none"
          stroke="var(--data-1)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="line-draw"
        />
        {points.map((p, i) => (
          <circle
            key={`${p.workout_date}-${i}`}
            cx={x(i)}
            cy={y(p.e1rm)}
            r={i === last ? 5 : 3}
            fill={i === last ? "var(--data-1)" : "var(--surface-app)"}
            stroke="var(--data-1)"
            strokeWidth={i === last ? 0 : 2}
            className="chart-fade"
          />
        ))}
        <text
          x={x(last)}
          y={y(points[last].e1rm) - 12}
          textAnchor={points.length === 1 ? "middle" : "end"}
          fill="var(--text-1)"
          fontSize={13}
          fontWeight={800}
          className="chart-fade tabular-nums"
        >
          {formatNumber(points[last].e1rm)} kg
        </text>
        {bestIndex !== last && (
          <text x={x(bestIndex)} y={y(max) - 10} textAnchor="middle" fill="var(--text-2)" fontSize={11} fontWeight={600} className="chart-fade">
            {formatNumber(max)}
          </text>
        )}
        <text x={PAD.left} y={HEIGHT - 4} fill="var(--text-2)" fontSize={11}>
          {formatDayMonth(points[0].workout_date)}
        </text>
        {points.length > 1 && (
          <text x={WIDTH - PAD.right} y={HEIGHT - 4} textAnchor="end" fill="var(--text-2)" fontSize={11}>
            {formatDayMonth(points[last].workout_date)}
          </text>
        )}
      </svg>
      <table className="pjs-vh">
        <caption>Najlepszy e1RM z każdego treningu</caption>
        <thead>
          <tr>
            <th scope="col">Data</th>
            <th scope="col">e1RM</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={`${p.workout_date}-${i}`}>
              <td>{formatDayMonth(p.workout_date)}</td>
              <td>{formatNumber(p.e1rm)} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
