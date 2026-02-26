"use client";

import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="glass rounded-2xl p-12 max-w-lg mx-auto">
          <motion.h1
            className="text-8xl font-bold neon-text mb-4"
            animate={{
              textShadow: [
                "0 0 10px rgba(0, 217, 255, 0.8)",
                "0 0 20px rgba(0, 217, 255, 1)",
                "0 0 10px rgba(0, 217, 255, 0.8)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            404
          </motion.h1>
          
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            Looks like this shuttle went out of bounds!
          </p>
          
          <Link href="/">
            <Button variant="neon" size="lg">
              <Home className="mr-2 w-5 h-5" />
              Return Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
