import { ICursorComponentProps } from "../../interfaces/ICursorComponentProps";

export const DefaultCursor = (props: ICursorComponentProps) => {
  const { x, y } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={{
        position: "absolute",
        left: x - 2,
        top: y - 2,
        pointerEvents: "none",
        transform: "scale(0.8)",
        zIndex: 1000,
      }}
    >
      <path
        d="M 0,0 L 0,20 L 4.5,15.5 L 8.75,23 L 11,22 L 6.75,15 L 13.75,15 Z"
        fill="black"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};
