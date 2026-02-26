"use client";

import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';
import { Calendar, Clock, MapPin, Users, Trophy, Target } from "lucide-react";

export default function OverviewPage() {
  const stats = [
    { icon: Users, label: "Teams", value: "32" },
    { icon: Target, label: "Groups", value: "8" },
  ];

  const overview_cards = [
    {
      icon: MapPin,
      label: "Location",
      value: "LSBI Badminton Arena",
      helper: "",
      valueClassName: "text-xl font-semibold text-slate-900",
    },
    {
      icon: Clock,
      label: "Tournament Starting Date",
      value: "6th April - 23rd April",
      helper: "5:30 PM - 7:30 PM",
      valueClassName: "text-xl font-semibold text-slate-900",
    },
    {
      icon: Calendar,
      label: "Registration Fee",
      value: "₹2000 per team",
      helper: "Jerseys and exciting goodies included",
      valueClassName: "text-xl font-semibold text-slate-900",
    },
    {
      icon: Trophy,
      label: "Tie Format",
      value: "3 matches per tie (best of 3)",
      helper: "Men’s Singles • Women’s Singles • Mixed Doubles",
      valueClassName: "text-base font-semibold text-slate-900",
    },
    {
      icon: Users,
      label: "Teams",
      value: "32",
      helper: "",
      valueClassName: "text-4xl font-bold neon-text",
    },
    {
      icon: Target,
      label: "Groups",
      value: "8",
      helper: "",
      valueClassName: "text-4xl font-bold neon-text",
    },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.svg
            className="absolute right-0 top-0 w-96 h-96 opacity-10"
            viewBox="0 0 200 200"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3581B8" />
                <stop offset="100%" stopColor="#A1CDF4" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>

        <div className="text-center space-y-6 mb-16">
          <motion.h1
            className="text-5xl md:text-7xl font-bold neon-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Coditas Badminton League
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            A clean, high-energy badminton tournament at Coditas. Register your team and compete in a best-of-3 tie across Singles and Doubles.
          </motion.p>

          <motion.div
            className="max-w-5xl mx-auto mt-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {overview_cards.map((card) => (
                <motion.div
                  key={card.label}
                  className="glass rounded-xl p-6 glass-hover"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <card.icon className="w-8 h-8 text-neon-blue mb-4" />

                  <div className={card.valueClassName}>{card.value}</div>
                  <div className="text-slate-600 mt-1">{card.label}</div>

                  {card.helper ? (
                    <div className="text-xs text-slate-500 mt-2">
                      {card.helper}
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="glass rounded-xl p-8 max-w-4xl mx-auto text-left">
            <h2 className="text-2xl font-bold mb-2">How it works</h2>
            <p className="text-slate-600 leading-relaxed">
              The league runs through group matches and then knockout rounds. Every tie has 3 matches:
              Men&apos;s Singles, Women&apos;s Singles, and Mixed Doubles. Win 2 matches to win the tie.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-lg border border-border bg-white/70 p-4">
                <h3 className="font-semibold">Team composition</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Each team registers 4 players: 2 men and 2 women.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-white/70 p-4">
                <h3 className="font-semibold">On match day</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Arrive early, warm up quickly, and be ready to start when your court is called.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-white/70 p-4">
                <h3 className="font-semibold">Registration flow</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Submit details and you&apos;ll receive a unique team name allocation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
