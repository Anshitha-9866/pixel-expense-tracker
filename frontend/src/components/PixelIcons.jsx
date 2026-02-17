import { CATEGORY_EMOJIS } from "../utils/categories";

export function CategoryIcon({ category, size = 16 }) {
  return (
    <span style={{ fontSize: size }}>
      {CATEGORY_EMOJIS[category] || "📦"}
    </span>
  );
}

export function Coin({ size = 16 }) {
  return <span style={{ fontSize: size }}>🪙</span>;
}

export function Heart({ size = 16 }) {
  return <span style={{ fontSize: size }}>❤️</span>;
}

export function Star({ size = 16 }) {
  return <span style={{ fontSize: size }}>⭐</span>;
}

// 8x8 pixel heart SVG for decoration
export function PixelHeart({ color = "#f472b6", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="0" width="2" height="1" fill={color} />
      <rect x="5" y="0" width="2" height="1" fill={color} />
      <rect x="0" y="1" width="3" height="2" fill={color} />
      <rect x="4" y="1" width="3" height="2" fill={color} />
      <rect x="0" y="3" width="8" height="2" fill={color} />
      <rect x="1" y="5" width="6" height="1" fill={color} />
      <rect x="2" y="6" width="4" height="1" fill={color} />
      <rect x="3" y="7" width="2" height="1" fill={color} />
    </svg>
  );
}

// 8x8 pixel coin SVG
export function PixelCoin({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="0" width="4" height="1" fill="#fbbf24" />
      <rect x="1" y="1" width="6" height="1" fill="#fbbf24" />
      <rect x="0" y="2" width="8" height="4" fill="#fbbf24" />
      <rect x="1" y="6" width="6" height="1" fill="#fbbf24" />
      <rect x="2" y="7" width="4" height="1" fill="#fbbf24" />
      <rect x="3" y="2" width="2" height="1" fill="#f59e0b" />
      <rect x="2" y="3" width="4" height="2" fill="#f59e0b" />
      <rect x="3" y="5" width="2" height="1" fill="#f59e0b" />
    </svg>
  );
}
