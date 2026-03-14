"use client";

import { useState, useEffect } from "react";
import { Wind, Play, Square, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Phase = "idle" | "inhale" | "hold" | "exhale";

export default function BreathingTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  // 🌟 新增：记录开始深呼吸的时间点
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      } else {
        if (phase === "idle" || phase === "exhale") {
          setPhase("inhale");
          setTimeLeft(4);
        } else if (phase === "inhale") {
          setPhase("hold");
          setTimeLeft(7);
        } else if (phase === "hold") {
          setPhase("exhale");
          setTimeLeft(8);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft, phase]);

  const toggleSession = async () => {
    if (isActive) {
      setIsActive(false);
      setPhase("idle");
      setTimeLeft(0);

      // 🌟 新增核心逻辑：停止时计算时长，并存入数据库！
      if (sessionStartTime) {
        const durationInSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
        
        // 如果呼吸超过 10 秒，我们就认为这是一次有效的放松，记录下来
        if (durationInSeconds >= 10) {
          try {
            await fetch('/api/activity', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: "BREATHING",
                duration: durationInSeconds,
                completed: true
              })
            });
          } catch (error) {
            console.error("Failed to save activity", error);
          }
        }
      }

      toast.success("Great job taking a moment for yourself. You are grounded.", {
        icon: <Sparkles className="w-4 h-4 text-teal-500" />
      });
    } else {
      setIsActive(true);
      setPhase("inhale");
      setTimeLeft(4);
      setSessionStartTime(Date.now()); // 🌟 记录按下的那一刻
      toast.info("Find a comfortable position. Let's begin.");
    }
  };

  const getCircleStyles = () => {
    switch (phase) {
      case "inhale": return "scale-[2] bg-teal-200/50 border-teal-300 duration-[4000ms] ease-out";
      case "hold": return "scale-[2] bg-emerald-200/50 border-emerald-300 duration-[7000ms] ease-linear";
      case "exhale": return "scale-100 bg-stone-200/50 border-stone-300 duration-[8000ms] ease-in-out";
      default: return "scale-100 bg-stone-100 border-stone-200 duration-500";
    }
  };

  const getInstruction = () => {
    switch (phase) {
      case "inhale": return "Breathe in through your nose...";
      case "hold": return "Hold your breath...";
      case "exhale": return "Exhale slowly through your mouth...";
      default: return "Ready to reset your mind?";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-16 pb-24 px-4 sm:px-6 flex flex-col items-center min-h-[80vh] justify-center">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 flex items-center justify-center gap-3">
          <Wind className="w-8 h-8 text-teal-600" />
          4-7-8 Breathing
        </h1>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          A scientifically proven pattern to reduce anxiety and snap out of ADHD paralysis instantly.
        </p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-16">
        <div className={`absolute inset-0 rounded-full border-[4px] transition-all transform-gpu ${getCircleStyles()}`} />
        <div className="relative z-10 w-40 h-40 bg-white rounded-full shadow-sm border border-stone-100 flex flex-col items-center justify-center backdrop-blur-md">
          {isActive ? (
            <span className="text-6xl font-light text-teal-700 font-mono tracking-tighter">{timeLeft}</span>
          ) : (
            <Wind className="w-12 h-12 text-stone-300" />
          )}
        </div>
      </div>

      <div className="h-12 mb-12">
        <p className={`text-2xl font-medium text-center transition-all duration-500 ${isActive ? 'text-teal-700 scale-105' : 'text-stone-400'}`}>
          {getInstruction()}
        </p>
      </div>

      <button
        onClick={toggleSession}
        className={`flex items-center justify-center px-8 py-4 text-lg font-medium rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-48 ${
          isActive ? 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200' : 'bg-teal-600 text-white hover:bg-teal-700'
        }`}
      >
        {isActive ? <><Square className="w-5 h-5 mr-2 fill-current" /> Stop</> : <><Play className="w-5 h-5 mr-2 fill-current" /> Start</>}
      </button>
    </div>
  );
}