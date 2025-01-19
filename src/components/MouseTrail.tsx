import React from "react";
import { IPoint } from "../interfaces/IPoint";

interface ITrailProps {
  points: IPoint[];
  length?: number;
}

export const MouseTrail = (props: ITrailProps) => {
  const { points } = props;
  if (points.length < 2) return null;

  const totalSegments = points.length - 1; // # of lines

  const svgStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 50,
  } as React.CSSProperties;

  return (
    <svg style={svgStyle}>
      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];

        // Adjust coordinates for scroll position
        const x1 = prev.x - window.scrollX;
        const y1 = prev.y - window.scrollY;
        const x2 = p.x - window.scrollX;
        const y2 = p.y - window.scrollY;

        // i ranges 1..N => so alpha can be (i / totalSegments)
        // or any fade function you like
        const alpha = i / totalSegments;

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`rgba(0, 0, 0, ${alpha})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
