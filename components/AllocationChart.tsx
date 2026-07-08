"use client";

import { useMemo, useState } from "react";
import { formatKRW } from "@/lib/format";

const SERIES_COLORS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
  "var(--series-8)",
];

export interface AllocationSlice {
  label: string;
  value: number;
}

export default function AllocationChart({ data }: { data: AllocationSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const [hovered, setHovered] = useState<number | null>(null);

  const segments = useMemo(() => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const gap = total > 0 ? 3 : 0; // deg gap between segments
    let cursor = -90; // start at top
    return data.map((d, i) => {
      const fraction = total > 0 ? d.value / total : 0;
      const sweep = fraction * 360 - (data.length > 1 ? gap : 0);
      const start = cursor;
      cursor += sweep + (data.length > 1 ? gap : 0);
      return {
        ...d,
        color: SERIES_COLORS[i % SERIES_COLORS.length],
        fraction,
        dasharray: `${(sweep / 360) * circumference} ${circumference}`,
        rotation: start,
        radius,
        circumference,
      };
    });
  }, [data, total]);

  if (total <= 0) {
    return (
      <div
        className="rounded-xl border p-6 text-sm text-center"
        style={{ borderColor: "var(--border-hairline)", color: "var(--text-muted)" }}
      >
        등록된 자산이 없습니다. 자산 관리 탭에서 먼저 자산을 추가해보세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
        <svg viewBox="0 0 160 160" width={160} height={160}>
          <g transform="translate(80,80)">
            {segments.map((s, i) => (
              <circle
                key={s.label}
                r={s.radius}
                fill="none"
                stroke={s.color}
                strokeWidth={hovered === i ? 20 : 16}
                strokeDasharray={s.dasharray}
                strokeLinecap="round"
                transform={`rotate(${s.rotation})`}
                style={{ transition: "stroke-width 120ms ease" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hovered !== null ? (
            <>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {segments[hovered].label}
              </span>
              <span className="text-sm font-semibold">
                {Math.round(segments[hovered].fraction * 100)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                총 자산
              </span>
              <span className="text-sm font-semibold">{formatKRW(total)}</span>
            </>
          )}
        </div>
      </div>

      <ul className="flex-1 w-full space-y-1.5 text-sm">
        {segments.map((s, i) => (
          <li
            key={s.label}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1 -mx-2 cursor-default"
            style={{ backgroundColor: hovered === i ? "var(--gridline)" : "transparent" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="truncate" style={{ color: "var(--text-primary)" }}>
                {s.label}
              </span>
            </span>
            <span className="flex items-baseline gap-2 shrink-0 tabular-nums">
              <span style={{ color: "var(--text-secondary)" }}>{formatKRW(s.value)}</span>
              <span className="w-10 text-right" style={{ color: "var(--text-muted)" }}>
                {Math.round(s.fraction * 100)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
