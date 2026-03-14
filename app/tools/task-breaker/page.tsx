"use client";

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, Loader2, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner'; // 🌟 引入 toast 触发器

export default function TaskBreaker() {
  const [task, setTask] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleBreakdown = async () => {
    if (!task.trim()) {
      toast.warning("Please enter a task first!"); // 优雅的警告弹窗
      return;
    }

    setIsGenerating(true);
    setSteps([]);
    setCompletedSteps([]);

    // 开始生成时的提示
    toast.info("Breaking down your task into micro-steps...");

    try {
      const response = await fetch('/api/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to break down task');
      }

      if (data.steps && Array.isArray(data.steps)) {
        setSteps(data.steps);
        // 🌟 成功时的华丽弹窗
        toast.success("Task broken down successfully! You got this.");
      }
    } catch (error: any) {
      console.error("Error breaking down task:", error);
      // 🌟 失败时的优雅报错，不再是丑陋的 alert()
      toast.error(`Oops: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      const newCompleted = [...completedSteps, index];
      setCompletedSteps(newCompleted);
      
      // 当勾选了一个步骤时，给一点正向反馈
      toast.success("Great job taking that step!", {
        icon: <Check className="w-4 h-4 text-emerald-500" />
      });

      // 如果全部做完了，给个大大的鼓励
      if (newCompleted.length === steps.length && steps.length > 0) {
        toast.success("🎉 Incredible! You completed the entire task!");
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-16 pb-24 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-teal-600" />
          Task Breaker
        </h1>
        <p className="text-stone-500 text-lg">
          Feeling overwhelmed? Paste your big task below, and AI will break it down into tiny, manageable steps.
        </p>
      </div>

      {/* 🌟 优化了输入框容器的 UI：加入了 focus-within 让用户点击时有漂亮的青色光晕 */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row gap-2 mb-12 transition-all duration-300 focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-400 focus-within:shadow-md">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g., Organize my entire digital life..."
          className="flex-1 px-4 py-3 outline-none text-stone-700 bg-transparent placeholder:text-stone-400"
          onKeyDown={(e) => e.key === 'Enter' && handleBreakdown()}
        />
        <button
          onClick={handleBreakdown}
          disabled={isGenerating || !task.trim()}
          className="bg-teal-600 hover:bg-teal-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center min-w-[140px] shadow-sm hover:shadow active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Thinking...
            </>
          ) : (
            <>
              Break it down <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* 拆解步骤列表保持不变，但勾选时会触发 toast */}
      {steps.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-semibold text-stone-900 mb-6">Your Micro-Steps:</h2>
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            return (
              <div
                key={index}
                onClick={() => toggleStep(index)}
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                  isCompleted 
                    ? 'bg-stone-50 border-stone-200 opacity-60 scale-[0.98]' 
                    : 'bg-white border-teal-100 hover:border-teal-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-teal-600 transition-transform duration-300">
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                <p className={`text-lg transition-all duration-300 ${
                  isCompleted ? 'text-stone-400 line-through' : 'text-stone-700'
                }`}>
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}