"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className="w-16 h-16 text-neon-blue mx-auto mb-4" />
        </motion.div>
        <p className="text-gray-400">Loading...</p>
      </motion.div>
    </div>
  );
}
