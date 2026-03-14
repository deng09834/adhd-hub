"use client";

import { useState, useEffect } from "react";
import { Wind, Play, Square, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Phase = "idle" | "inhale" | "hold" | "exhale";

export default function BreathingTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive) {
      if (timeLeft > 0) {
        // 倒计时逻辑
        timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      } else {
        // 阶段切换逻辑 (4-7-8 呼吸法)
        if (phase === "idle" || phase === "exhale") {
          setPhase("inhale");
          setTimeLeft(4); // 吸气 4 秒
        } else if (phase === "inhale") {
          setPhase("hold");
          setTimeLeft(7); // 屏气 7 秒
        } else if (phase === "hold") {
          setPhase("exhale");
          setTimeLeft(8); // 呼气 8 秒
        }
      }
    }

    return () => clearTimeout(timer);
  }, [isActive, timeLeft, phase]);

  const toggleSession = () => {
    if (isActive) {
      // 停止训练
      setIsActive(false);
      setPhase("idle");
      setTimeLeft(0);
      toast.success("Great job taking a moment for yourself. You are grounded.", {
        icon: <Sparkles className="w-4 h-4 text-teal-500" />
      });
    } else {
      // 开始训练
      setIsActive(true);
      setPhase("inhale");
      setTimeLeft(4);
      toast.info("Find a comfortable position. Let's begin.");
    }
  };

  // 根据不同阶段，动态改变圆圈的大小和颜色，制造“呼吸感”
  const getCircleStyles = () => {
    switch (phase) {
      case "inhale":
        return "scale-[2] bg-teal-200/50 border-teal-300 duration-[4000ms] ease-out";
      case "hold":
        return "scale-[2] bg-emerald-200/50 border-emerald-300 duration-[7000ms] ease-linear";
      case "exhale":
        return "scale-100 bg-stone-200/50 border-stone-300 duration-[8000ms] ease-in-out";
      default:
        return "scale-100 bg-stone-100 border-stone-200 duration-500";
    }
  };

  // 根据阶段显示温柔的提示语
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
      
      {/* 头部信息 */}
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 flex items-center justify-center gap-3">
          <Wind className="w-8 h-8 text-teal-600" />
          4-7-8 Breathing
        </h1>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          A scientifically proven pattern to reduce anxiety and snap out of ADHD paralysis instantly.
        </p>
      </div>

      {/* 核心视觉区：呼吸圆环 */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-16">
        {/* 背景光晕 (随着呼吸变化) */}
        <div 
          className={`absolute inset-0 rounded-full border-[4px] transition-all transform-gpu ${getCircleStyles()}`}
        />
        
        {/* 中心固定圆：显示倒计时 */}
        <div className="relative z-10 w-40 h-40 bg-white rounded-full shadow-sm border border-stone-100 flex flex-col items-center justify-center backdrop-blur-md">
          {isActive ? (
            <span className="text-6xl font-light text-teal-700 font-mono tracking-tighter">
              {timeLeft}
            </span>
          ) : (
            <Wind className="w-12 h-12 text-stone-300" />
          )}
        </div>
      </div>

      {/* 文字引导 */}
      <div className="h-12 mb-12">
        <p className={`text-2xl font-medium text-center transition-all duration-500 ${isActive ? 'text-teal-700 scale-105' : 'text-stone-400'}`}>
          {getInstruction()}
        </p>
      </div>

      {/* 控制按钮 */}
      <button
        onClick={toggleSession}
        className={`flex items-center justify-center px-8 py-4 text-lg font-medium rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-48 ${
          isActive 
            ? 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200' 
            : 'bg-teal-600 text-white hover:bg-teal-700'
        }`}
      >
        {isActive ? (
          <>
            <Square className="w-5 h-5 mr-2 fill-current" /> Stop
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2 fill-current" /> Start
          </>
        )}
      </button>

    </div>
  );
}