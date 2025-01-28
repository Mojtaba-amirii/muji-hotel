"use client";

import React, { useState, useEffect } from "react";
import ThemeContext from "@/context/themeContext";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeFromStorage: boolean =
    typeof localStorage !== "undefined" && localStorage.getItem("hotel-theme")
      ? JSON.parse(localStorage.getItem("hotel-theme")!)
      : false;

  const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage);
  const [renderComponent, setRenderComponent] = useState<boolean>(false);

  useEffect(() => {
    setRenderComponent(true);
  }, []);

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
