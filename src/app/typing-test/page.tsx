"use client";

import { useEffect, useState } from "react";
import { useTypingStore } from "@/lib/store";
import TypingBox from "@/components/TypingBox";
import Timer from "@/components/Timer";
import MetricsDisplay from "@/components/MetricsDisplay";
import KeyboardLayout from "@/components/KeyboardLayout";
import ResultCard from "@/components/ResultCard";
import LanguageToggle from "@/components/LanguageToggle";
import { Loader2, FileText } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TypingTestContent() {
  const { isFinished, setContent, language, setLanguage } = useTypingStore();
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");

  useEffect(() => {
    if (langParam === "Hindi" || langParam === "English") {
      setLanguage(langParam);
    }
  }, [langParam, setLanguage]);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/paragraphs?language=${language}`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setContent(data[randomIndex].content);
        } else {
          // Fallback if no data in DB
          const fallback = language === 'English' 
            ? "In the rapidly evolving world of digital information technology, the ability to process and communicate data quickly and accurately has become a cornerstone of professional success. Computer literacy is no longer just an additional skill but a fundamental requirement in almost every sector of the global economy. From complex data analysis to simple administrative tasks, technology integrates into our daily workflows, demanding a high level of proficiency and adaptability. Developing a strong typing speed with high accuracy allows professionals to translate their thoughts into digital form seamlessly, thereby increasing productivity and reducing cognitive strain. As we move further into the age of artificial intelligence and automated systems, the human element remains vital in guiding these tools and ensuring that the output aligns with organizational goals and ethical standards."
            : "डिजिटल सूचना प्रौद्योगिकी की तेजी से बदलती दुनिया में, डेटा को जल्दी और सही तरीके से संसाधित और संप्रेषित करने की क्षमता पेशेवर सफलता का एक आधार बन गई है। कंप्यूटर साक्षरता अब केवल एक अतिरिक्त कौशल नहीं है, बल्कि वैश्विक अर्थव्यवस्था के लगभग हर क्षेत्र में एक मौलिक आवश्यकता है। जटिल डेटा विश्लेषण से लेकर सरल प्रशासनिक कार्यों तक, प्रौद्योगिकी हमारे दैनिक वर्कफ़्लो में एकीकृत होती है, जिसमें उच्च स्तर की दक्षता और अनुकूलन क्षमता की आवश्यकता होती है। उच्च सटीकता के साथ एक मजबूत टाइपिंग गति विकसित करने से पेशेवरों को अपने विचारों को डिजिटल रूप में निर्बाध रूप से अनुवाद करने की अनुमति मिलती है जिससे उत्पादकता बढ़ती है और मानसिक तनाव कम होता है। जैसे-धीरे हम कृत्रिम बुद्धिमत्ता और स्वचालित प्रणालियों के युग में आगे बढ़ते हैं, इन उपकरणों का मार्गदर्शन करने और यह सुनिश्चित करने में मानवीय तत्व महत्वपूर्ण बना रहता है कि आउटपुट संगठनात्मक लक्ष्यों और नैतिक मानकों के साथ संरेखित हो।";
          setContent(fallback);
        }

      } catch (error) {
        console.error("Failed to fetch content", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [language, setContent]);

  return (
    <div className="pt-10 pb-20 px-6 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] gap-4">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Preparing Examination...</p>
        </div>
      ) : !isFinished ? (
        <div className="space-y-10 animate-in fade-in duration-700">
          {/* Top Stats Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 w-full">
              <MetricsDisplay />
            </div>
            <div className="w-full lg:w-72">
              <Timer />
            </div>
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-zinc-200">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-brand-primary" size={24} />
              {language} Typing Test
            </h2>
            <LanguageToggle />
          </div>

          {/* Main Typing Area */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-orange-400 rounded-[32px] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
            <TypingBox />
          </div>

          <div className="text-center">
            <p className="text-zinc-400 text-sm italic py-4 border-y border-zinc-100 dark:border-zinc-800 inline-block px-10">
              Tip: Keep your fingers relaxed and look at the screen, not the keyboard.
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-in zoom-in-95 duration-500">
          <ResultCard />
        </div>
      )}
      <KeyboardLayout />
    </div>
  );
}

export default function TypingTestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TypingTestContent />
    </Suspense>
  );
}

