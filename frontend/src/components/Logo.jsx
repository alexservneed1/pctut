import React from "react";

// «ПК ТУТ» — white «ПК» + blue «ТУТ» inside a rounded blue neon frame.
// Pure SVG/JSX, no image asset.
export const Logo = ({ size = "md", className = "" }) => {
  const scale = {
    sm: { text: "text-lg", pad: "px-2 py-0.5", gap: "gap-1.5" },
    md: { text: "text-2xl", pad: "px-2.5 py-1", gap: "gap-2" },
    lg: { text: "text-3xl", pad: "px-3 py-1.5", gap: "gap-2.5" },
  }[size];

  return (
    <div
      className={`inline-flex items-center ${scale.gap} font-extrabold tracking-tight select-none ${className}`}
      data-testid="brand-logo"
      aria-label="ПК ТУТ"
    >
      <span className={`${scale.text} text-white`}>ПК</span>
      <span
        className={`${scale.text} ${scale.pad} rounded-md border-2 text-[#0A84FF]`}
        style={{
          borderColor: "#0A84FF",
          boxShadow:
            "0 0 10px rgba(10,132,255,0.55), inset 0 0 6px rgba(10,132,255,0.25)",
          textShadow: "0 0 6px rgba(10,132,255,0.6)",
        }}
      >
        ТУТ
      </span>
    </div>
  );
};

export default Logo;
