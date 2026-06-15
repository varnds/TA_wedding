import React from "react";

function winterFrost(currentSeasonKey, stroke, x, y) {
  if (currentSeasonKey !== "winter") return null;
  return (
    <g fill="#FFFFFF" stroke={stroke} strokeWidth="1" opacity="0.9">
      <polygon points={`${x - 18},${y + 148} ${x - 16},${y + 161} ${x - 14},${y + 148}`} />
      <polygon points={`${x + 14},${y + 148} ${x + 16},${y + 161} ${x + 18},${y + 148}`} />
    </g>
  );
}

export function IndianGarmentShape({
  typeKey,
  x,
  y,
  fill,
  fabricFill,
  stroke,
  accent,
  currentSeasonKey,
}) {
  switch (typeKey) {
    case "LEHENGA":
      return (
        <g stroke="none" strokeLinejoin="round">
          {/* flared lehenga skirt */}
          <path
            d={`M${x - 14} ${y + 32}
              L${x - 32} ${y + 158}
              Q${x} ${y + 168}, ${x + 32} ${y + 158}
              L${x + 14} ${y + 32}
              Q${x} ${y + 28}, ${x - 14} ${y + 32} Z`}
            fill={fill}
          />
          <path
            d={`M${x - 14} ${y + 32}
              L${x - 32} ${y + 158}
              Q${x} ${y + 168}, ${x + 32} ${y + 158}
              L${x + 14} ${y + 32}
              Q${x} ${y + 28}, ${x - 14} ${y + 32} Z`}
            fill={fabricFill}
          />
          {/* choli bodice */}
          <path
            d={`M${x - 16} ${y}
              L${x - 18} ${y + 34}
              Q${x} ${y + 38}, ${x + 18} ${y + 34}
              L${x + 16} ${y}
              Q${x} ${y + 10}, ${x - 16} ${y} Z`}
            fill={fill}
          />
          <path d={`M${x - 6} ${y + 4} L${x} ${y + 22} L${x + 6} ${y + 4}`} fill="none" stroke={stroke} strokeWidth="1.2" />
          <path d={`M${x - 28} ${y + 150} Q${x} ${y + 160}, ${x + 28} ${y + 150}`} stroke={accent} strokeWidth="3.5" fill="none" opacity="0.75" />
          <g fill={accent} opacity="0.65">
            <circle cx={x} cy={y + 12} r="1.2" />
            <circle cx={x} cy={y + 20} r="1.2" />
          </g>
          {winterFrost(currentSeasonKey, stroke, x, y)}
        </g>
      );

    case "KURTA":
      return (
        <g stroke="none" strokeLinejoin="round">
          <path
            d={`M${x - 22} ${y}
              L${x - 20} ${y + 28}
              L${x - 26} ${y + 38}
              L${x - 24} ${y + 148}
              L${x - 8} ${y + 152}
              L${x - 8} ${y + 132}
              L${x + 8} ${y + 132}
              L${x + 8} ${y + 152}
              L${x + 24} ${y + 148}
              L${x + 26} ${y + 38}
              L${x + 20} ${y + 28}
              L${x + 22} ${y}
              Q${x} ${y + 12}, ${x - 22} ${y} Z`}
            fill={fill}
          />
          <path
            d={`M${x - 22} ${y}
              L${x - 20} ${y + 28}
              L${x - 26} ${y + 38}
              L${x - 24} ${y + 148}
              L${x - 8} ${y + 152}
              L${x - 8} ${y + 132}
              L${x + 8} ${y + 132}
              L${x + 8} ${y + 152}
              L${x + 24} ${y + 148}
              L${x + 26} ${y + 38}
              L${x + 20} ${y + 28}
              L${x + 22} ${y}
              Q${x} ${y + 12}, ${x - 22} ${y} Z`}
            fill={fabricFill}
          />
          <path d={`M${x - 8} ${y + 6} L${x} ${y + 42} L${x + 8} ${y + 6}`} fill="none" stroke={stroke} strokeWidth="1.3" />
          <path d={`M${x - 24} ${y + 142} L${x - 8} ${y + 142} M${x + 8} ${y + 142} L${x + 24} ${y + 142}`} stroke={accent} strokeWidth="2.5" fill="none" opacity="0.7" />
          {winterFrost(currentSeasonKey, stroke, x, y)}
        </g>
      );

    case "DUPATTA":
      return (
        <g stroke="none" strokeLinejoin="round">
          <path
            d={`M${x - 8} ${y}
              C${x - 18} ${y + 60}, ${x - 22} ${y + 110}, ${x - 26} ${y + 162}
              Q${x - 14} ${y + 170}, ${x - 4} ${y + 160}
              C${x - 2} ${y + 110}, ${x - 4} ${y + 55}, ${x - 2} ${y + 6} Z`}
            fill={fill}
          />
          <path
            d={`M${x - 8} ${y}
              C${x - 18} ${y + 60}, ${x - 22} ${y + 110}, ${x - 26} ${y + 162}
              Q${x - 14} ${y + 170}, ${x - 4} ${y + 160}
              C${x - 2} ${y + 110}, ${x - 4} ${y + 55}, ${x - 2} ${y + 6} Z`}
            fill={fabricFill}
          />
          <path
            d={`M${x + 6} ${y + 4}
              C${x + 16} ${y + 65}, ${x + 14} ${y + 115}, ${x + 18} ${y + 155}
              Q${x + 28} ${y + 162}, ${x + 34} ${y + 148}
              C${x + 30} ${y + 100}, ${x + 32} ${y + 55}, ${x + 24} ${y} Z`}
            fill={fill}
          />
          <path
            d={`M${x + 6} ${y + 4}
              C${x + 16} ${y + 65}, ${x + 14} ${y + 115}, ${x + 18} ${y + 155}
              Q${x + 28} ${y + 162}, ${x + 34} ${y + 148}
              C${x + 30} ${y + 100}, ${x + 32} ${y + 55}, ${x + 24} ${y} Z`}
            fill={fabricFill}
          />
          <path d={`M${x - 22} ${y + 158} Q${x - 12} ${y + 166}, ${x - 4} ${y + 156}`} stroke={accent} strokeWidth="2.5" fill="none" opacity="0.75" />
          <path d={`M${x + 16} ${y + 148} Q${x + 26} ${y + 155}, ${x + 32} ${y + 144}`} stroke={accent} strokeWidth="2.5" fill="none" opacity="0.75" />
          {winterFrost(currentSeasonKey, stroke, x, y)}
        </g>
      );

    case "CHURIDAR":
      return (
        <g stroke="none" strokeLinejoin="round">
          <path
            d={`M${x - 20} ${y} h40
              C${x + 22} ${y + 55}, ${x + 14} ${y + 108}, ${x + 10} ${y + 138}
              q-4 10 -8 2 L${x + 2} ${y + 72}
              L${x - 2} ${y + 138} q-4 10 -8 2
              C${x - 14} ${y + 108}, ${x - 22} ${y + 55}, ${x - 20} ${y} Z`}
            fill={fill}
          />
          <rect x={x - 20} y={y} width="40" height="145" fill={fabricFill} opacity="0.55" />
          <g stroke={stroke} strokeWidth="0.8" fill="none" opacity="0.55">
            {[118, 126, 134, 142].map((dy, i) => (
              <path key={`l${i}`} d={`M${x - 16} ${y + dy} q8 4 14 0`} />
            ))}
            {[118, 126, 134, 142].map((dy, i) => (
              <path key={`r${i}`} d={`M${x + 2} ${y + dy} q8 4 14 0`} />
            ))}
          </g>
          <path d={`M${x - 18} ${y + 4} Q${x} ${y + 10}, ${x + 18} ${y + 4}`} stroke={accent} strokeWidth="2" fill="none" opacity="0.65" />
          {winterFrost(currentSeasonKey, stroke, x, y)}
        </g>
      );

    case "SAREE":
      return (
        <g stroke="none" strokeLinejoin="round">
          {/* pleated body */}
          <path
            d={`M${x - 24} ${y}
              L${x - 28} ${y + 150}
              Q${x - 4} ${y + 162}, ${x + 8} ${y + 150}
              L${x + 6} ${y}
              Q${x} ${y + 10}, ${x - 24} ${y} Z`}
            fill={fill}
          />
          <path
            d={`M${x - 24} ${y}
              L${x - 28} ${y + 150}
              Q${x - 4} ${y + 162}, ${x + 8} ${y + 150}
              L${x + 6} ${y}
              Q${x} ${y + 10}, ${x - 24} ${y} Z`}
            fill={fabricFill}
          />
          {/* pallu drape */}
          <path
            d={`M${x + 6} ${y + 2}
              C${x + 22} ${y + 20}, ${x + 38} ${y + 55}, ${x + 42} ${y + 100}
              C${x + 44} ${y + 130}, ${x + 36} ${y + 155}, ${x + 28} ${y + 158}
              L${x + 10} ${y + 80}
              Q${x + 8} ${y + 40}, ${x + 6} ${y + 2} Z`}
            fill={fill}
            opacity="0.92"
          />
          <path
            d={`M${x + 6} ${y + 2}
              C${x + 22} ${y + 20}, ${x + 38} ${y + 55}, ${x + 42} ${y + 100}
              C${x + 44} ${y + 130}, ${x + 36} ${y + 155}, ${x + 28} ${y + 158}
              L${x + 10} ${y + 80}
              Q${x + 8} ${y + 40}, ${x + 6} ${y + 2} Z`}
            fill={fabricFill}
            opacity="0.85"
          />
          <g stroke={accent} strokeWidth="0.9" fill="none" opacity="0.45">
            <path d={`M${x - 20} ${y + 18} L${x - 22} ${y + 145}`} />
            <path d={`M${x - 12} ${y + 16} L${x - 14} ${y + 148}`} />
            <path d={`M${x - 4} ${y + 14} L${x - 6} ${y + 150}`} />
          </g>
          <path d={`M${x - 26} ${y + 144} Q${x - 4} ${y + 158}, ${x + 8} ${y + 144}`} stroke={accent} strokeWidth="4" fill="none" opacity="0.75" />
          <path d={`M${x + 30} ${y + 150} Q${x + 38} ${y + 132}, ${x + 40} ${y + 100}`} stroke={accent} strokeWidth="2" fill="none" opacity="0.6" />
          {winterFrost(currentSeasonKey, stroke, x, y)}
        </g>
      );

    default:
      return null;
  }
}
