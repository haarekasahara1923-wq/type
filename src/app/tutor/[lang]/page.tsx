"use client";

import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LESSONS } from "@/data/lessons";

export default function DynamicTutorPage() {
  const params = useParams();
  const lang = ((params.lang as string) || "hindi").toLowerCase();
  const capitalLang = lang.charAt(0).toUpperCase() + lang.slice(1);

  // Fallback to English if lang is not found
  const tutorId = lang === 'hindi' || lang === 'english' ? lang : 'english';
  const displayLessons = LESSONS[tutorId as keyof typeof LESSONS];

  return (
    <div className="bg-zinc-50 min-h-screen pb-20 pt-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-12 space-y-4">
          <Link href="/" className="text-zinc-400 hover:text-brand-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-6 transition-colors">
            <ArrowRight className="rotate-180" size={14} /> Back to Home
          </Link>
          <h1 className="text-4xl font-black text-zinc-900 flex items-center gap-4">
            <div className="p-3 bg-brand-primary rounded-2xl text-white shadow-lg">
              <BookOpen size={32} />
            </div>
            {capitalLang} Typing Tutor
          </h1>
          <p className="text-zinc-500 font-medium max-w-2xl">
            A comprehensive, step-by-step course designed to take you from a beginner to a pro typist in record time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="bg-white border border-zinc-200 p-8 rounded-[40px] hover:border-brand-primary group transition-all shadow-sm hover:shadow-xl"
            >
               <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] bg-orange-50 px-4 py-1.5 rounded-full">
                    Lesson {lesson.id}
                  </span>
                  {lesson.id === 1 && <CheckCircle2 className="text-green-500" size={20} />}
               </div>
               <h3 className="text-2xl font-black text-zinc-900 group-hover:text-brand-primary transition-colors mb-2">{lesson.title}</h3>
               <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-medium">{lesson.desc}</p>
               <Link 
                  href={`/typing-test?lang=${capitalLang}&content=${encodeURIComponent(lesson.content)}`}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 group-hover:bg-brand-primary transition-all shadow-lg active:scale-95"
               >
                 Start Lesson <ArrowRight size={18} />
               </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-zinc-900 rounded-[40px] p-10 text-white text-center">
           <h2 className="text-3xl font-black mb-4">Master Typing Like a Pro</h2>
           <p className="text-zinc-400 mb-8 max-w-xl mx-auto font-medium">Follow our structured path and increase your speed by up to 40% in just two weeks.</p>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="p-4 border border-white/10 rounded-2xl">
                 <div className="text-brand-primary font-black text-2xl mb-1">56+</div>
                 <div className="text-xs uppercase tracking-widest font-bold text-zinc-500">Interactive Lessons</div>
              </div>
              <div className="p-4 border border-white/10 rounded-2xl">
                 <div className="text-brand-primary font-black text-2xl mb-1">100k+</div>
                 <div className="text-xs uppercase tracking-widest font-bold text-zinc-500">Active Students</div>
              </div>
              <div className="p-4 border border-white/10 rounded-2xl">
                 <div className="text-brand-primary font-black text-2xl mb-1">08+</div>
                 <div className="text-xs uppercase tracking-widest font-bold text-zinc-500">Regional Languages</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
