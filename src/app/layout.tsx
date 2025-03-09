import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify"
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import { GlobalContextProvider } from "@/context/global-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Solana Token Mint",
  description: "Mint solana tokens here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1b1622] text-white`}
      >
        <div className="py-8 px-4 gap-4 container mx-auto">
          <GlobalContextProvider>
            <ToastContainer theme="dark" />
            <Navbar />
            {children}
          </GlobalContextProvider>
        </div>
      </body>
    </html>
  );
}
