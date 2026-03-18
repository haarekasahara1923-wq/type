"use client";

import { useEffect, useState, useCallback } from "react";
import { useTypingStore } from "@/lib/store";
import TypingBox from "@/components/TypingBox";
import Timer from "@/components/Timer";
import MetricsDisplay from "@/components/MetricsDisplay";
import KeyboardLayout from "@/components/KeyboardLayout";
import ResultCard from "@/components/ResultCard";
import LanguageToggle from "@/components/LanguageToggle";
import { Loader2, FileText, Sparkles, RefreshCw, ArrowRight, Clock } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TypingTestContent() {
  const { isFinished, setContent, language, setLanguage, resetStore, selectedTime, setTimeLimit, isStarted } = useTypingStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");


  // Fallback paragraphs (Extra Long)
  const ENGLISH_FALLBACK = "In the rapidly evolving world of digital information technology, the ability to process and communicate data quickly and accurately has become a cornerstone of professional success. Computer literacy is no longer just an additional skill but a fundamental requirement in almost every sector of the global economy. From complex data analysis to simple administrative tasks, technology integrates into our daily workflows, demanding a high level of proficiency and adaptability. Developing a strong typing speed with high accuracy allows professionals to translate their thoughts into digital form seamlessly, thereby increasing productivity and reducing cognitive strain. As we move further into the age of artificial intelligence and automated systems, the human element remains vital in guiding these tools and ensuring that the output aligns with organizational goals and ethical standards. Furthermore, the psychological benefits of mastering touch typing cannot be overstated. It fosters a sense of flow, where the barrier between the mind and the machine dissolves, enabling a purely creative output. This mastery over the primary interface of our modern age is an investment that pays dividends throughout a professional's career, ensuring they remain competitive in a fast-paced environment. Continuous practice and refinement of these skills are essential for anyone aspiring to excel in the digital landscape of the twenty-first century. Typing is not merely the act of pressing keys, but a bridge between human thought and digital realization. In today's economy, speed and accuracy are the dual engines of professional progress.";
  const HINDI_FALLBACK = "डिजिटल सूचना प्रौद्योगिकी की तेजी से बदलती दुनिया में, डेटा को जल्दी और सही तरीके से संसाधित और संप्रेषित करने की क्षमता पेशेवर सफलता का एक आधार बन गई है। कंप्यूटर साक्षरता अब केवल एक अतिरिक्त कौशल नहीं है, बल्कि वैश्विक अर्थव्यवस्था के लगभग हर क्षेत्र में एक मौलिक आवश्यकता है। जटिल डेटा विश्लेषण से लेकर सरल प्रशासनिक कार्यों तक, प्रौद्योगिकी हमारे दैनिक वर्कफ़्लो में एकीकृत होती है, जिसमें उच्च स्तर की दक्षता और अनुकूलन क्षमता की आवश्यकता होती है। उच्च सटीकता के साथ एक मजबूत टाइपिंग गति विकसित करने से पेशेवरों को अपने विचारों को डिजिटल रूप में निर्बाध रूप से अनुवाद करने की अनुमति मिलती है जिससे उत्पादकता बढ़ती है और मानसिक तनाव कम होता है। जैसे-जैसे हम कृत्रिम बुद्धिमत्ता और स्वचालित प्रणालियों के युग में आगे बढ़ते हैं, इन उपकरणों का मार्गदर्शन करने और यह सुनिश्चित करने में मानवीय तत्व महत्वपूर्ण बना रहता है कि आउटपुट संगठनात्मक लक्ष्यों और नैतिक मानकों के साथ संरेखित हो। इसके अतिरिक्त, टाइपिंग कौशल में महारत हासिल करने के मनोवैज्ञानिक लाभों को कम करके नहीं आंका जा सकता है। यह प्रवाह की भावना को बढ़ावा देता है, जहां मन और मशीन के बीच का अवरोध कम हो जाता है, जिससे विशुद्ध रूप से रचनात्मक आउटपुट संभव होता है। आधुनिक युग के प्राथमिक इंटरफ़ेस पर यह महारत एक निवेश है जो पेशेवर के करियर में अत्यधिक लाभदायक सिद्ध होती है, जिससे यह सुनिश्चित होता है कि वे तेजी से बदलते परिवेश में प्रतिस्पर्धी बने रहें। इक्कीसवीं सदी के डिजिटल परिदृश्य में उत्कृष्टता प्राप्त करने की इच्छा रखने वाले किसी भी व्यक्ति के लिए इन कौशलों का निरंतर अभ्यास और शोधन आवश्यक है। टाइपिंग केवल कीबोर्ड पर उंगलियां चलाने का कार्य नहीं है, बल्कि मानव विचार और डिजिटल अभिव्यक्ति के बीच एक सेतु है। आज की अर्थव्यवस्था में, गति और सटीकता पेशेवर प्रगति के दो प्रमुख स्तंभ हैं।";

  useEffect(() => {
    if (langParam === "Hindi" || langParam === "English") {
      setLanguage(langParam);
    }
  }, [langParam, setLanguage]);

  const fetchExistingContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/paragraphs?language=${language}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        // Randomly pick from existing
        const randomIndex = Math.floor(Math.random() * data.length);
        setContent(data[randomIndex].content);
      } else {
        setContent(language === 'English' ? ENGLISH_FALLBACK : HINDI_FALLBACK);
      }
    } catch (error) {
      console.error("Failed to fetch content", error);
      setContent(language === 'English' ? ENGLISH_FALLBACK : HINDI_FALLBACK);
    } finally {
      setIsLoading(false);
      // Ensure we stay at the top after content loads
      setTimeout(() => window.scrollTo(0, 0), 100);
    }
  }, [language, setContent]);

  const generateNewContent = async () => {
    setIsGenerating(true);
    resetStore(); // Reset everything
    try {
      const res = await fetch('/api/paragraphs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, difficulty: 'Intermediate' })
      });
      const data = await res.json();
      if (data && data.content) {
        setContent(data.content);
        // Scroll to top immediately after generation
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } catch (error) {
       console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Disable automatic scroll restoration to fix jumping
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    fetchExistingContent();
  }, [fetchExistingContent]);

  return (
    <div className="pt-6 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] gap-4">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Preparing Examination...</p>
        </div>
      ) : !isFinished ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Main Controls Overlay for AI/Language (Pinned better for Mobile) */}
          <div className="bg-white p-4 rounded-3xl border border-zinc-200 shadow-xl flex flex-wrap items-center justify-between gap-4 sticky top-20 z-40 md:relative md:top-0">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileText className="text-brand-primary" size={20} />
                </div>
                <div>
                  <h2 className="font-black text-zinc-900 leading-tight">
                    {language} Examination
                  </h2>
                </div>
             </div>

             <div className="flex flex-wrap items-center gap-2">
               {/* Time Selection Dropdown */}
               <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-xl">
                 <Clock size={14} className="text-zinc-400" />
                 <select 
                   disabled={isStarted}
                   value={Math.round(selectedTime / 60)}
                   onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                   className="bg-transparent text-xs font-black text-zinc-700 outline-none cursor-pointer disabled:cursor-not-allowed"
                   title="Select Test Duration"
                 >
                   {Array.from({ length: 60 }, (_, i) => i + 1).map(m => (
                     <option key={m} value={m}>{m} MINUTES</option>
                   ))}

                 </select>
               </div>

               <button 
                 onClick={generateNewContent}
                 disabled={isGenerating}
                 className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
               >
                 {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                 {isGenerating ? "GENERATING..." : "NEW AI TEST"}
               </button>
               <LanguageToggle />
             </div>

          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="md:col-span-3">
                <MetricsDisplay />
             </div>
             <div>
                <Timer />
             </div>
          </div>

          {/* Typing Area */}
          <TypingBox />

          {/* Footer Actions */}
          <div className="flex flex-col items-center gap-6 py-8">
             <button 
               onClick={() => { resetStore(); fetchExistingContent(); window.scrollTo(0,0); }}
               className="flex items-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
             >
               <RefreshCw size={14} /> Restart Test
             </button>
             <div className="text-zinc-300 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="h-px w-12 bg-zinc-200" />
                PROFESSIONAL TYPING CENTER
                <div className="h-px w-12 bg-zinc-200" />
             </div>
          </div>
        </div>
      ) : (
        <div className="animate-in zoom-in-95 duration-500">
          <ResultCard />
          <div className="mt-8 flex justify-center">
             <button 
               onClick={() => { resetStore(); fetchExistingContent(); }}
               className="px-10 py-5 bg-brand-primary text-white font-black rounded-[2rem] shadow-2xl shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-4 italic text-lg"
             >
               START ANOTHER TEST <ArrowRight size={24} />
             </button>
          </div>
        </div>
      )}
      <KeyboardLayout />
    </div>
  );
}

export default function TypingTestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>}>
      <TypingTestContent />
    </Suspense>
  );
}
