"use client";

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
import { motion } from "framer-motion";
import TeamCard from "@/components/TeamCard";
import { fetchTeams, Team } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTeams();
      setTeams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold neon-text mb-4">
            Registered Teams
          </h1>
          <p className="text-gray-400">
            View all teams participating in the tournament
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-neon-blue mb-4" />
            <p className="text-gray-400">Loading teams...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="glass rounded-xl p-8 max-w-md text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={loadTeams}
                className="text-neon-blue hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="glass rounded-xl p-8 max-w-md text-center">
              <p className="text-gray-400 mb-4">
                No team registered yet. Be the first to register!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="glass inline-block rounded-full px-6 py-3">
                <span className="text-gray-400 ml-2">
                   Total Teams Registered: &nbsp;
                </span>
                <span className="text-neon-blue font-bold text-lg">
                  {teams.length}
                </span>
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {teams.map((team, index) => (
                <motion.div
                  key={team.teamName}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TeamCard team={team} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
