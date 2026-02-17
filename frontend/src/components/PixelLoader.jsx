export default function PixelLoader({ text = "Loading..." }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div className="pixel-loader">
        <div /><div /><div />
      </div>
      {text && (
        <p style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "8px",
          color: "var(--pink-500)",
          marginTop: "12px",
          letterSpacing: "0.5px",
          animation: "blink 1.2s step-start infinite",
        }}>
          {text}
        </p>
      )}
    </div>
  );
}
