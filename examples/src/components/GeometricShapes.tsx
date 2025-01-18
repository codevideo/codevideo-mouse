import { useEffect, useRef } from "react";

export const GeometricShapes = () => {
  // Generate random positions between 0-80 for each shape
  // Using 80 instead of 100 to keep shapes from going too close to edges
  const positionsRef = useRef<Array<{ x: number, y: number }>>();

  useEffect(() => {
    // Only generate positions once on mount
    if (!positionsRef.current) {
      positionsRef.current = Array(3)
        .fill(0)
        .map(() => ({
          x: Math.floor(Math.random() * 80),
          y: Math.floor(Math.random() * 80),
        }));
    }
  }, []);

  // Don't render until positions are set
  if (!positionsRef.current) return null;

  return (
    <div className="relative w-full h-96">
      <p className="m-5">Some shapes for your recording reference delight:</p>
      {/* Triangle (SVG) */}
      <div
        className="absolute"
        style={{
          top: `${positionsRef.current[0].y}%`,
          left: `${positionsRef.current[0].x}%`,
        }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64">
          <polygon points="32,0 0,64 64,64" fill="rgb(34, 197, 94)" />
        </svg>
      </div>

      {/* Square */}
      <div
        className="absolute w-16 h-16 bg-red-500"
        style={{
          top: `${positionsRef.current[1].y}%`,
          left: `${positionsRef.current[1].x}%`,
        }}
      />

      {/* Circle */}
      <div
        className="absolute w-16 h-16 rounded-full bg-pink-500"
        style={{
          top: `${positionsRef.current[2].y}%`,
          left: `${positionsRef.current[2].x}%`,
        }}
      />
    </div>
  );
};
