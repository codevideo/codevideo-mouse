import React from "react";

export const GeometricShapes = () => {
  // Generate random positions between 0-80 for each shape
  // Using 80 instead of 100 to keep shapes from going too close to edges
  const positions = [
    { x: 50, y: 8 },
    { x: 2, y: 30 },
    { x: 10, y: 76 },
  ]

  return (
    <div className="relative w-full h-96">
      <p className="m-5">Some shapes for your recording reference delight:</p>
      {/* Triangle (SVG) */}
      <div
        className="absolute"
        style={{
          top: `${positions[0].y}%`,
          left: `${positions[0].x}%`,
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
          top: `${positions[1].y}%`,
          left: `${positions[1].x}%`,
        }}
      />

      {/* Circle */}
      <div
        className="absolute w-16 h-16 rounded-full bg-pink-500"
        style={{
          top: `${positions[2].y}%`,
          left: `${positions[2].x}%`,
        }}
      />
    </div>
  );
};
