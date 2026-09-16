import React from "react";

type CloudProps = {
  width?: number;
  color?: string;
  style?: React.CSSProperties;
};

export const Cloud: React.FC<CloudProps> = ({
  width = 300,
  color = "#6E8299",
  style,
}) => {
  const height = width * (180 / 300);

  return (
    <svg
      viewBox="0 0 300 180"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <g fill={color}>
        <ellipse cx={88} cy={112} rx={62} ry={46} />
        <ellipse cx={152} cy={86} rx={72} ry={58} />
        <ellipse cx={218} cy={112} rx={58} ry={44} />
        <rect x={40} y={106} width={222} height={52} rx={26} />
      </g>
      <g
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2}
        opacity={0.35}
        clipPath="none"
      >
        <ellipse cx={150} cy={118} rx={64} ry={20} />
        <ellipse cx={150} cy={118} rx={36} ry={20} />
        <path d="M150 90 v56" />
        <path d="M86 118 h128" />
      </g>
    </svg>
  );
};
