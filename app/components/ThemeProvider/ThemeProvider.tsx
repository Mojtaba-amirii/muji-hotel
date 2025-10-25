"use client";

import React, { useState, useEffect } from "react";
import ThemeContext from "@/context/themeContext";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [renderComponent, setRenderComponent] = useState<boolean>(false);

  useEffect(() => {
    // Load theme from localStorage only on client side
    const themeFromStorage =
      typeof window !== "undefined" && localStorage.getItem("hotel-theme")
        ? JSON.parse(localStorage.getItem("hotel-theme")!)
        : false;

    setDarkTheme(themeFromStorage);
    setRenderComponent(true);
  }, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    if (typeof window !== "undefined") {
      localStorage.setItem("hotel-theme", JSON.stringify(darkTheme));
    }
  }, [darkTheme]);

  if (!renderComponent) return <></>;

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
