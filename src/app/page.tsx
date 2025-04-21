"use client";

import { SunIcon } from "@/components/Sun";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Convert from "@/components/Convert";
import { MoonIcon } from "@/components/Moon";
import { Button } from "@/components/ui/button";

const ConverterPage = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative min-h-screen dark:bg-slate-900 bg-gray-100 text-white p-4">
      <Button
        variant="ghost"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="absolute top-4 right-4 rounded-xl md:[&_svg:not([class*='size-'])]:size-6"
        asChild
      >
        {isDark ? <SunIcon /> : <MoonIcon className="text-black" />}
      </Button>

      <motion.h1
        className="text-2xl lg:text-4xl font-bold dark:text-sky-400 text-zinc-700 text-center mb-4 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        JSX & JSON Converter
      </motion.h1>

      <Convert />
    </div>
  );
};

export default ConverterPage;
