"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Keyboard, 
  ChevronDown, 
  Monitor, 
  BookOpen, 
  FileText, 
  Gamepad2, 
  RefreshCcw, 
  Download,
  Menu,
  X,
  Languages,
  UserCircle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
interface NavItem {
  name: string;
  icon: JSX.Element;
  href?: string;
  dropdown?: { name: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    name: "Typing",
    icon: <Languages size={18} />,
    dropdown: [
      { name: "Hindi Typing", href: "/typing/hindi" },
      { name: "English Typing", href: "/typing/english" },
      { name: "Punjabi Typing", href: "/typing/punjabi" },
      { name: "Marathi Typing", href: "/typing/marathi" },
    ]
  },
  {
    name: "Keyboard",
    icon: <Keyboard size={18} />,
    dropdown: [
      { name: "Hindi Keyboard", href: "/keyboard/hindi" },
      { name: "English Keyboard", href: "/keyboard/english" },
      { name: "All Keyboards", href: "/keyboard" },
    ]
  },
  {
    name: "Tutor",
    icon: <BookOpen size={18} />,
    dropdown: [
      { name: "Hindi Tutor", href: "/tutor/hindi" },
      { name: "English Tutor", href: "/tutor/english" },
    ]
  },
  {
    name: "Test",
    icon: <FileText size={18} />,
    dropdown: [
      { name: "Hindi Typing Test", href: "/typing-test?lang=Hindi" },
      { name: "English Typing Test", href: "/typing-test?lang=English" },
      { name: "Exam Mode", href: "/typing-test?mode=exam" },
    ]
  },
  {
    name: "Game",
    icon: <Gamepad2 size={18} />,
    dropdown: [
      { name: "Typing Tank War", href: "/games/tank-war" },
      { name: "Word Rush", href: "/games/word-rush" },
    ]
  },
  {
    name: "Converter",
    icon: <RefreshCcw size={18} />,
    dropdown: [
      { name: "KrutiDev to Unicode", href: "/converter/krutidev-to-unicode" },
      { name: "Unicode to KrutiDev", href: "/converter/unicode-to-krutidev" },
      { name: "All Online Converters", href: "/converter/index" },
    ]
  },
  {
    name: "Download",
    icon: <Download size={18} />,
    href: "/download"
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          
          {/* Logo - flex-shrink-0 so it never gets squished */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
                EM
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="text-[18px] font-black tracking-tighter text-[#000000] leading-none uppercase whitespace-nowrap">
                  Emax
                </span>
                <span className="text-[11px] font-black tracking-widest text-[#ff6600] leading-none uppercase mt-1 whitespace-nowrap">
                  Computer Education Center
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - takes available space */}
          <div className="hidden lg:flex items-center space-x-0 flex-1">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-brand-primary transition-colors hover:bg-zinc-50 rounded-md whitespace-nowrap">
                    {item.icon}
                    {item.name}
                    <ChevronDown size={14} className={cn("transition-transform", activeDropdown === item.name && "rotate-180")} />
                  </button>
                ) : (
                  <Link 
                    href={item.href || "#"} 
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-brand-primary transition-colors hover:bg-zinc-50 rounded-md whitespace-nowrap"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )}

                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-zinc-200 rounded-lg shadow-xl py-2 z-50">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-zinc-600 hover:bg-brand-primary/5 hover:text-brand-primary font-medium"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Auth - flex-shrink-0 so it never gets hidden */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0 ml-auto">
            {status === "loading" ? (
              <div className="w-20 h-8 bg-zinc-100 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-2">
                {session.user?.role === "admin" && (
                  <Link 
                    href="/admin/dashboard" 
                    className="flex items-center gap-1.5 px-3 py-2 text-zinc-600 hover:text-brand-primary hover:bg-zinc-100 rounded-lg text-sm font-bold transition-colors"
                    title="Admin Panel"
                  >
                    <Monitor size={16} /> Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-3 border-l border-zinc-200">
                   <div className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                     <UserCircle size={20} className="text-brand-primary flex-shrink-0" />
                     <span className="max-w-[100px] truncate">Hello, {session.user?.name?.split(" ")[0] || "Student"}</span>
                   </div>
                   <button 
                     onClick={() => signOut({ callbackUrl: "/" })}
                     className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                   >
                     <LogOut size={16} /> Sign Out
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/auth/login"
                  className="px-4 py-2 text-zinc-600 hover:text-brand-primary text-sm font-bold transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button and User Actions */}
          <div className="flex lg:hidden items-center gap-2">
            {status !== "loading" && !session && (
              <Link 
                href="/auth/login"
                className="px-4 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-full mr-1"
              >
                Sign In
              </Link>
            )}
            {status !== "loading" && session && (
              <span className="text-sm font-bold text-zinc-700 max-w-[100px] truncate mr-1">
                Hi, {session.user?.name?.split(" ")[0] || "Student"}
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-zinc-500 hover:text-brand-primary hover:bg-zinc-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-zinc-100 px-4 py-4 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.dropdown ? (
                <>
                  <div className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mt-4 first:mt-0">
                    {item.name}
                  </div>
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block px-3 py-2 text-base font-medium text-zinc-600 hover:text-brand-primary hover:bg-zinc-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="block px-3 py-2 text-base font-semibold text-zinc-700 hover:text-brand-primary hover:bg-zinc-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          
          <div className="mt-6 pt-4 border-t border-zinc-100">
             {session ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 text-zinc-800 font-bold">
                    <UserCircle size={24} className="text-brand-primary" />
                    Hello, {session.user?.name || "Student"}
                  </div>
                  {session.user?.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-3 py-3 text-base font-bold text-zinc-700 hover:text-brand-primary hover:bg-zinc-50 rounded-md mt-2 flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Monitor size={20} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-3 text-base font-bold text-red-500 hover:bg-red-50 rounded-md mt-2 flex items-center gap-2"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </>
             ) : (
                <div className="space-y-3 mt-4">
                  <Link
                    href="/auth/login"
                    className="flex justify-center w-full px-4 py-3 bg-zinc-100 text-zinc-800 font-bold rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex justify-center w-full px-4 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-orange-500/20"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
