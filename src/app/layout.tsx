import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoHindi = Noto_Sans_Devanagari({ 
  subsets: ["devanagari"], 
  weight: ["400", "500", "700", "900"],
  variable: "--font-hindi"
});

export const metadata: Metadata = {
  title: "E-Max Typing Lab - Computer Education Center",
  description: "Advanced White-label Typing Practice Platform for Computer Institutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, notoHindi.variable, "antialiased font-sans")}>
        {children}
      </body>
    </html>
  );
}

