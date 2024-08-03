"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render nothing on the server and until the theme is mounted
    return null;
  }

  return (
    <div>
      {theme === "dark" ? (
        <Button
          variant="ghost"
          className=" border-zinc-900 ml-4 bg-white hover:text-[#000] hover:bg-[#f7f3f3] text-black transition "
          size="icon"
          onClick={() => setTheme("light")}
        >
          <Sun className="w-5 h-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#f7f3f3] border-zinc-100 bg-inherit ml-4 bg-white transition"
          onClick={() => setTheme("dark")}
        >
          <Moon className="w-5 h-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      )}
    </div>
  );
}
