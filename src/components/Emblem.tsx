import { emblem } from '@/content/emblem';

/**
 * The official Foursquare emblem (traced from foursquare.org.ng), built from its four
 * separate symbols so each tile can be animated on its own.
 * Layout matches the original: cross | cup  over  dove | crown.
 *
 * `colored` reproduces the official colour version (red cross, blue cup, gold dove,
 * purple crown — sampled from foursquare.org.ng/images/foursquare-logo.png): each tile
 * takes its colour and a light panel sits behind it so the symbol reads white.
 */
export const EMBLEM_ORDER = ['cross', 'cup', 'dove', 'crown'] as const;
export type EmblemPart = (typeof EMBLEM_ORDER)[number];

export const EMBLEM_COLORS: Record<EmblemPart, string> = {
  cross: '#d82820',
  cup: '#0080c0',
  dove: '#f8c000',
  crown: '#984878',
};

// Tile origin within a 938 × 943 box (the official artwork's proportions).
export const TILE_POS: Record<EmblemPart, [number, number]> = {
  cross: [0, 0],
  cup: [487, 0],
  dove: [0, 492],
  crown: [487, 492],
};

// The inner panel of each 451-unit tile (inside the frame line and gap).
const PANEL = { x: 38, y: 38, size: 375 };

function Tile({ part, colored, color, symbolColor, tileClass }: {
  part: EmblemPart; colored: boolean; color: string; symbolColor: string; tileClass: string;
}) {
  return (
    <g className={`${tileClass} emblem-${part}`} style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
      {colored && (
        <rect className={`emblem-panel emblem-panel-${part}`} x={PANEL.x} y={PANEL.y} width={PANEL.size} height={PANEL.size} fill={symbolColor} />
      )}
      <path d={emblem[part].d} fill={colored ? EMBLEM_COLORS[part] : color} fillRule="evenodd" />
    </g>
  );
}

export function Emblem({
  className = '',
  tileClass = '',
  color = '#f3ede3',
  colored = false,
  symbolColor = '#ffffff',
  title = 'Foursquare emblem: cross, cup, dove and crown',
}: {
  className?: string;
  tileClass?: string;
  color?: string;
  colored?: boolean;
  symbolColor?: string;
  title?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 938 943" role="img" aria-label={title} overflow="visible">
      {EMBLEM_ORDER.map((part) => (
        <g key={part} transform={`translate(${TILE_POS[part][0]} ${TILE_POS[part][1]})`}>
          <Tile part={part} colored={colored} color={color} symbolColor={symbolColor} tileClass={tileClass} />
        </g>
      ))}
    </svg>
  );
}

/** A single symbol tile. */
export function EmblemTile({ part, className = '', colored = true, color = '#f3ede3' }: {
  part: EmblemPart; className?: string; colored?: boolean; color?: string;
}) {
  return (
    <svg className={className} viewBox={emblem[part].viewBox} aria-hidden>
      <Tile part={part} colored={colored} color={color} symbolColor="#ffffff" tileClass="" />
    </svg>
  );
}
