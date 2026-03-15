"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Keyboard, 
  ChevronDown, 
  Search, 
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { data: session } = useSession();

  // Flatten all sub-items for searching
  const searchableItems: { name: string; href: string; parent: string | null }[] = [];
  navItems.forEach(item => {
    if (item.dropdown) {
      item.dropdown.forEach(sub => {
        searchableItems.push({ name: sub.name, href: sub.href, parent: item.name });
      });
    } else {
      searchableItems.push({ name: item.name, href: item.href || "#", parent: null });
    }
  });

  const filteredResults = searchableItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
                EM
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-black tracking-tighter text-[#000000] leading-none uppercase whitespace-nowrap">
                  Emax
                </span>
                <span className="text-[11px] font-black tracking-widest text-[#ff6600] leading-none uppercase mt-1 whitespace-nowrap">
                  Computer Education Center
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-zinc-700 hover:text-brand-primary transition-colors hover:bg-zinc-50 rounded-md">
                    {item.icon}
                    {item.name}
                    <ChevronDown size={14} className={cn("transition-transform", activeDropdown === item.name && "rotate-180")} />
                  </button>
                ) : (
                  <Link 
                    href={item.href || "#"} 
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-zinc-700 hover:text-brand-primary transition-colors hover:bg-zinc-50 rounded-md"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )}

                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute left-0 mt-0 w-56 bg-white border border-zinc-200 rounded-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
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

          {/* Right Side - Search & Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-primary/50 w-48 transition-all focus:w-64 outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              
              {/* Search Results Dropdown */}
              {showSearchResults && filteredResults.length > 0 && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-zinc-200 rounded-2xl shadow-2xl py-3 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Search Results</div>
                  {filteredResults.map((result, idx) => (
                    <Link
                      key={idx}
                      href={result.href}
                      className="block px-4 py-2 hover:bg-zinc-50 group"
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearchResults(false);
                      }}
                    >
                      <div className="text-sm font-bold text-zinc-800 group-hover:text-brand-primary">{result.name}</div>
                      {result.parent && <div className="text-[10px] text-zinc-400 uppercase font-black">{result.parent}</div>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.role === "admin" && (
                  <Link 
                    href="/admin" 
                    className="p-2 text-zinc-500 hover:text-brand-primary hover:bg-zinc-100 rounded-full transition-colors"
                    title="Admin Panel"
                  >
                    <Monitor size={20} />
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-4 border-l border-zinc-200">
                   <div className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                     <UserCircle size={20} className="text-brand-primary" />
                     <span className="max-w-[100px] truncate">{session.user?.name || "Student"}</span>
                   </div>
                   <button 
                     onClick={() => signOut()}
                     className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                     title="Sign Out"
                   >
                     <LogOut size={18} />
                   </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="px-6 py-2 bg-brand-primary text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
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
                    {session.user?.name}
                  </div>
                  {session.user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-3 py-3 text-base font-bold text-zinc-700 hover:text-brand-primary hover:bg-zinc-50 rounded-md mt-2 flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Monitor size={20} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
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
