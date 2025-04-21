"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { SunIcon } from "./Sun";
import { MoonIcon } from "./Moon";
import { useEffect, useState } from "react";

function DarkmodeSwitch() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = () => {
    theme == "dark" ? setTheme("light") : setTheme("dark");
  };

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      onClick={handleThemeChange}
      className="absolute top-4 right-4 rounded-xl md:[&_svg:not([class*='size-'])]:size-6"
      asChild
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon className="text-black" />}
    </Button>
  );
}

export default DarkmodeSwitch;
