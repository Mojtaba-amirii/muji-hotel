"use client";

import ThemeContext from "@/context/themeContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { data: session } = useSession();
  console.log(session);

  return (
    <header className=" py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
      <div className=" flex items-center w-full md:w-2/3 ">
        <Link
          href="/"
          className=" font-black text-tertiary-dark tracking-widest focus:outline-none hover:scale-105 duration-500 transition-all"
        >
          MUJI HOTEL
        </Link>
        <ul className=" flex items-center justify-around ml-5">
          <li className="flex items-center">
            {session?.user ? (
              <Link href={`/users/${session.user.id}`}>
                {session.user.image ? (
                  <div className=" w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt={session.user.name!}
                      width={40}
                      height={40}
                      className="img scale-animation"
                    />
                  </div>
                ) : (
                  <FaUserCircle className=" cursor-pointer hover:scale-105 duration-500 transition-all" />
                )}
              </Link>
            ) : (
              <Link href="/auth">
                <FaUserCircle className=" cursor-pointer hover:scale-105 duration-500 transition-all" />
              </Link>
            )}
          </li>
          <li className=" ml-3 ">
            {darkTheme ? (
              <MdOutlineLightMode
                className=" cursor-pointer hover:scale-105 duration-500 transition-all"
                onClick={() => {
                  setDarkTheme(false);
                  localStorage.removeItem("hotel-theme");
                }}
              />
            ) : (
              <MdDarkMode
                className=" cursor-pointer hover:scale-105 duration-500 transition-all"
                onClick={() => {
                  setDarkTheme(true);
                  localStorage.setItem("hotel-theme", "true");
                }}
              />
            )}
          </li>
        </ul>
      </div>

      <ul className=" flex items-center justify-between w-full md:w-1/3 mt-4">
        <li className=" hover:-translate-y-2 duration-500 transition-all">
          <Link href="/">Home</Link>
        </li>
        <li className=" hover:-translate-y-2 duration-500 transition-all">
          <Link href="/rooms">Rooms</Link>
        </li>
        <li className=" hover:-translate-y-2 duration-500 transition-all">
          <Link href="/">Contact</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
