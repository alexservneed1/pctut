import React from "react";
import { motion } from "framer-motion";

// Decorative circuit-board / PCB-trace SVG. Used as background flourish.
export const PCBTrace = ({ className = "", opacity = 0.25 }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="pcbLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(10,132,255,0)" />
          <stop offset="50%" stopColor="rgba(10,132,255,0.9)" />
          <stop offset="100%" stopColor="rgba(0,163,255,0)" />
        </linearGradient>
      </defs>
      <g stroke="url(#pcbLine)" strokeWidth="1.2" fill="none">
        <path d="M0 80 L180 80 L220 40 L400 40 L440 80 L620 80 L660 120 L800 120" />
        <path d="M0 220 L120 220 L160 260 L340 260 L380 220 L560 220 L600 180 L800 180" />
        <path d="M0 340 L200 340 L240 300 L500 300 L540 340 L800 340" />
      </g>
      <g fill="#00A3FF">
        <circle cx="180" cy="80" r="3" />
        <circle cx="440" cy="80" r="3" />
        <circle cx="660" cy="120" r="3" />
        <circle cx="160" cy="260" r="3" />
        <circle cx="380" cy="220" r="3" />
        <circle cx="600" cy="180" r="3" />
        <circle cx="240" cy="300" r="3" />
        <circle cx="540" cy="340" r="3" />
      </g>
    </svg>
  );
};

// A horizontal PCB trace used as the connector between 4 process steps.
export const PCBConnector = () => (
  <svg
    className="absolute inset-x-0 top-8 hidden md:block pointer-events-none w-full"
    viewBox="0 0 1200 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    preserveAspectRatio="none"
    style={{ height: 40 }}
  >
    <defs>
      <linearGradient id="pcbConn" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(10,132,255,0.15)" />
        <stop offset="15%" stopColor="rgba(10,132,255,0.9)" />
        <stop offset="85%" stopColor="rgba(0,163,255,0.9)" />
        <stop offset="100%" stopColor="rgba(0,163,255,0.15)" />
      </linearGradient>
    </defs>
    <motion.path
      d="M60 20 L280 20 L310 8 L590 8 L620 20 L890 20 L920 32 L1140 32"
      stroke="url(#pcbConn)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.6, ease: "easeInOut" }}
    />
    <g fill="#00A3FF">
      <circle cx="280" cy="20" r="2.5" />
      <circle cx="620" cy="20" r="2.5" />
      <circle cx="920" cy="32" r="2.5" />
    </g>
  </svg>
);

export default PCBTrace;
