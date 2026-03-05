"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import confetti from "canvas-confetti";

interface TeamRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
}

export default function TeamRevealModal({
  isOpen,
  onClose,
  teamName,
}: TeamRevealModalProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRevealed(false);
    }
  }, [isOpen]);

  const handleReveal = () => {
    setRevealed(true);
    
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#9900E6", "#11CAE6", "#FF174F", "#5B0FFE", "#FFFFFF"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#9900E6", "#11CAE6", "#FF174F", "#5B0FFE", "#FFFFFF"],
      });
    }, 250);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-brand-violet max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.h2
            className="text-3xl font-bold mb-6 neon-text"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            Registration Successful!
          </motion.h2>

          <p className="text-black-300 mb-8">
            Thank you for registering in the Coditas Badminton League
          </p>

          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-4"
              >
                <p className="neon-text mb-4">
                  Click below to reveal your team name
                </p>
                <motion.button
                  onClick={handleReveal}
                  className="glass-hover neon-border rounded-xl p-8 w-full cursor-pointer group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(135deg, rgba(153,0,230,0.15), rgba(17,202,230,0.15))" }}
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="text-xl font-bold relative z-10 font-urbanist">
                    ✨ Click to Reveal ✨
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="space-y-4"
              >
                <p className="neon-text mb-4">Your Team Name is:</p>
                <motion.div
                  className="glass neon-border rounded-xl p-8"
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.h3
                    className="text-4xl font-bold neon-text"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                      delay: 0.2,
                    }}
                  >
                    {teamName}
                  </motion.h3>
                </motion.div>

                <motion.p
                  className="neon-text text-sm mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Check Registered Teams page to see your team listed
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
