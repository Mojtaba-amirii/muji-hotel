import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import ThemeProvider from "../components/ThemeProvider/ThemeProvider";
import { NextAuthProvider } from "../components/AuthProvider/AuthProvider";
import Toast from "../components/Toast/Toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["italic", "normal"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Muji hotel App",
  description: "Discover the best hotel rooms in the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NextAuthProvider>
          <ThemeProvider>
            <Header />
            <Toast />
            <main className=" font-normal">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}