"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

const committeeMembers = [
  {
    name: "Shatakshi Kokate",
    email: "shatakshi.kokate@coditas.com",
    phone: "+91-8308340896",
    image: "/assets/shatakshi.jpeg",
  },
  {
    name: "Akankshya Barua",
    email: "akankshya.barua@coditas.com",
    phone: "+91-6900905527",
    image: "/assets/akankshya.jpeg",
  },
  {
    name: "Payal Pathare",
    email: "payal.pathare@coditas.com",
    phone: "+91-7558592305",
    image: "/assets/payal.jpeg",
  },
  {
    name: "Toshit Jain",
    email: "tohit.jain@coditas.com",
    phone: "+91-7389847912",
    image: "/assets/toshit.jpeg",
  },
  {
    name: "Tanmay Sadhankar",
    email: "tanmay.sadhankar@coditas.com",
    phone: "+91-8550999929",
    image: "/assets/tanmay.jpeg",
  },
  {
    name: "Aman Kumar",
    email: "aman.kumar@coditas.com",
    phone: "+91-9971461729",
    image: "/assets/aman.jpeg",
  },
];

export default function CommitteePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl pb-2 font-bold neon-text mb-4">
            CBL Committee
          </h1>
          <p className="text-gray-500">
            Meet the team behind Coditas Badminton League
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
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
          {committeeMembers.map((member, index) => (
            <motion.div
              key={member.email}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="glass rounded-xl overflow-hidden glass-hover">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover border-2 border-neon-blue/30"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {member.name}
                  </h3>
                  <div className="space-y-2 w-full">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-neon-blue transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </a>
                    <a
                      href={`tel:${member.phone.replace(/-/g, "")}`}
                      className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-neon-blue transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
