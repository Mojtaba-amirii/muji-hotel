"use client";

import React, { useState, useEffect } from "react";
import ThemeContext from "@/context/themeContext";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize theme from localStorage during first render
  const [darkTheme, setDarkTheme] = useState<boolean>(() => {
    if (typeof window !== "undefined" && localStorage.getItem("hotel-theme")) {
      return JSON.parse(localStorage.getItem("hotel-theme")!);
    }
    return false;
  });
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after initial render to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    if (typeof window !== "undefined") {
      localStorage.setItem("hotel-theme", JSON.stringify(darkTheme));
    }
  }, [darkTheme]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <div className="min-h-screen w-full flex flex-col justify-center items-center text-black">
          {children}
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      <div
        className={`${darkTheme ? "dark" : ""} min-h-screen w-full flex flex-col justify-center items-center`}
      >
        <div className="min-h-screen w-full flex flex-col justify-center items-center dark:text-white dark:bg-black text-black">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
