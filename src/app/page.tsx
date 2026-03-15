"use client";

import Link from "next/link";
import { 
  Keyboard, 
  Languages, 
  Monitor, 
  FileText, 
  RefreshCcw, 
  ArrowRight,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";

const tools = [
  {
    category: "Typing Tools",
    icon: <Languages className="text-orange-500" size={24} />,
    items: [
      { name: "Hindi Typing", href: "/typing/hindi", desc: "Type in English to get Hindi text" },
      { name: "Marathi Typing", href: "/typing/marathi", desc: "Phonetic Marathi typing tool" },
      { name: "Punjabi Typing", href: "/typing/punjabi", desc: "Simple Panjabi typing software" },
      { name: "Tamil Typing", href: "/typing/tamil", desc: "Online Tamil typing tool" },
    ]
  },
  {
    category: "Typing Tests",
    icon: <FileText className="text-blue-500" size={24} />,
    items: [
      { name: "English Typing Test", href: "/typing-test?lang=English", desc: "Check your speed in English" },
      { name: "Hindi Typing Test", href: "/typing-test?lang=Hindi", desc: "Hindi Mangal/KrutiDev Test" },
      { name: "Exam Mode Test", href: "/typing-test?mode=exam", desc: "SSC/Railway Pattern Practice" },
      { name: "Custom Test", href: "/typing-test", desc: "Upload your own paragraph" },
    ]
  },
  {
    category: "Tutor & Keyboards",
    icon: <Keyboard className="text-green-500" size={24} />,
    items: [
      { name: "Hindi Typing Tutor", href: "/tutor/hindi", desc: "Step-by-step Hindi learning" },
      { name: "English Typing Tutor", href: "/tutor/english", desc: "56 Lessons for beginners" },
      { name: "Virtual Hindi Keyboard", href: "/keyboard/hindi", desc: "Type using mouse or keys" },
      { name: "All Online Keyboards", href: "/keyboard", desc: "100+ language keyboards" },
    ]
  },
  {
    category: "Converters & Games",
    icon: <RefreshCcw className="text-purple-500" size={24} />,
    items: [
      { name: "KrutiDev to Unicode", href: "/converter/krutidev-to-unicode", desc: "Universal font conversion" },
      { name: "Unicode to KrutiDev", href: "/converter/unicode-to-krutidev", desc: "Web content to Kruti Dev" },
      { name: "Typing Tank Game", href: "/games/tank-war", desc: "Destroy tanks by typing words" },
      { name: "Download Fonts", href: "/download", desc: "KrutiDev, Mangal, Asees" },
    ]
  }
];

export default function Home() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-zinc-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-brand-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-brand-primary px-4 py-1.5 rounded-full text-sm font-bold animate-bounce">
              <Zap size={16} fill="currentColor" />
              <span>Gwalior&apos;s #1 Computer Education Center</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-[1.1]">
              Master Skills at <span className="text-brand-primary">E-Max Education</span>
            </h1>
            
            <p className="text-xl text-zinc-500 font-medium">
              Free online tools for Hindi & English Typing, Speed Tests, Font Converters, and much more. Start practicing now and boost your productivity!
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                href="/typing-test?lang=English" 
                className="bg-brand-primary hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                English Typing Test <ArrowRight size={20} />
              </Link>
              <Link 
                href="/typing-test?lang=Hindi" 
                className="bg-zinc-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-zinc-900/20 transition-all hover:-translate-y-1"
              >
                Hindi Typing Test
              </Link>
            </div>

            <div className="flex justify-center items-center gap-8 pt-10 text-zinc-400">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">Fast Results</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">Accurate Metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">Exam Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Powerful Typing Tools</h2>
            <p className="text-zinc-500 mt-2 font-medium">Everything you need to improve your speed in one place.</p>
          </div>
          <Link href="#" className="text-brand-primary font-bold hover:underline flex items-center gap-1 group">
            View all 50+ tools <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((cat) => (
            <div key={cat.category} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-zinc-200 shadow-sm">
                  {cat.icon}
                </div>
                <h3 className="font-black text-zinc-800 uppercase tracking-wider text-sm">{cat.category}</h3>
              </div>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className="block p-4 bg-white border border-zinc-200 rounded-2xl hover:border-brand-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-zinc-900 group-hover:text-brand-primary transition-colors">{item.name}</h4>
                      <ArrowRight size={14} className="text-zinc-300 -rotate-45 group-hover:rotate-0 transition-transform group-hover:text-brand-primary" />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section / Why Choose Us */}
      <section className="bg-zinc-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black leading-tight">Why Choose E-Max Center for Your Training?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                    <Zap className="text-orange-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Advanced Transliteration</h4>
                    <p className="text-zinc-400 leading-relaxed">Our Roman to Devanagari script conversion is state-of-the-art. Just type phonetically and get accurate Hindi results instantly.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                    <Monitor className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Exam Oriented Practice</h4>
                    <p className="text-zinc-400 leading-relaxed">Prepare for government exams like SSC, Railway, and Banks with our dedicated exam modes that mimic real testing environments.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                    <Languages className="text-green-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Multi-Language Support</h4>
                    <p className="text-zinc-400 leading-relaxed">Not just Hindi and English. We support Punjabi, Marathi, Bengali, Telugu, Kannada and 10+ other languages.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6 text-sm">
                <div className="border-b border-white/10 pb-4">
                  <p className="font-bold text-orange-400 mb-2">How to increase typing speed?</p>
                  <p className="text-zinc-400">Regular practice, maintaining correct posture, and not looking at the keyboard are key. Use our tutor lessons to master the finger positions.</p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <p className="font-bold text-orange-400 mb-2">What is KrutiDev to Unicode?</p>
                  <p className="text-zinc-400">KrutiDev is a font-based encoding while Unicode is a global standard. Our converter helps you use KrutiDev text on the web easily.</p>
                </div>
                <div>
                  <p className="font-bold text-orange-400 mb-2">Are these tools free?</p>
                  <p className="text-zinc-400">Yes, every tool at E-Max Center is 100% free to use for students and professionals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-primary rounded-[40px] p-12 text-center text-white space-y-8 shadow-2xl shadow-orange-500/40">
            <h2 className="text-3xl md:text-5xl font-black">Ready to Start Practicing?</h2>
            <p className="text-xl text-white/80 font-medium">Join thousands of students who have improved their typing speed with our tools.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/typing-test" 
                className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:bg-black transition-colors"
              >
                Start Speed Test
              </Link>
              <Link 
                href="/keyboard" 
                className="bg-white text-brand-primary px-10 py-4 rounded-2xl font-bold text-xl hover:bg-zinc-50 transition-colors"
              >
                Virtual Keyboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
