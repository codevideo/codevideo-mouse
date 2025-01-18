import { ICursorComponentProps } from "../../interfaces/ICursorComponentProps";

export const TextSelectCursor = (props: ICursorComponentProps) => {
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
      <rect x="8" y="0" width="8" height="24" fill="black" />
      <rect x="6" y="2" width="12" height="2" fill="white" />
      <rect x="6" y="20" width="12" height="2" fill="white" />
    </svg>
  );
};
