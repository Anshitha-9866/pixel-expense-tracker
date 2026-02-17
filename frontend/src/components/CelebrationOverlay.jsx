import { motion, AnimatePresence } from "framer-motion";
import { PixelHeart, PixelCoin } from "./PixelIcons";
import { useEffect, useState } from "react";

export default function CelebrationOverlay({ show, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      // Generate random particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * -100 - 50,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.3,
        size: Math.random() * 12 + 12,
        type: Math.random() > 0.5 ? "heart" : "coin",
      }));
      setParticles(newParticles);

      // Auto-hide after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Center text */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 10 }}
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "20px",
              color: "var(--pink-500)",
              textShadow: "3px 3px 0px var(--black)",
              zIndex: 10,
            }}
          >
            ✨ EXPENSE ADDED! ✨
          </motion.div>

          {/* Confetti particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: "50vw",
                y: "50vh",
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: `calc(50vw + ${p.x}vw)`,
                y: `calc(50vh + ${p.y}vh)`,
                scale: [0, 1.2, 1],
                rotate: p.rotation,
              }}
              exit={{
                opacity: 0,
                y: "100vh",
              }}
              transition={{
                duration: 1.5,
                delay: p.delay,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                pointerEvents: "none",
              }}
            >
              {p.type === "heart" ? (
                <PixelHeart size={p.size} color="var(--pink-400)" />
              ) : (
                <PixelCoin size={p.size} />
              )}
            </motion.div>
          ))}

          {/* Radial burst effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: "4px solid var(--pink-400)",
              background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}