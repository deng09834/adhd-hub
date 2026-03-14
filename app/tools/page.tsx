import Dashboard from '@/components/Dashboard';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ToolsIndex() {
  return (
    <div className="w-full max-w-5xl mx-auto pt-16 pb-24 px-4 sm:px-6">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-teal-600" />
            Your Command Center
          </h1>
          <p className="text-stone-500 mt-2 text-lg">
            Track your progress, build momentum, and master your focus.
          </p>
        </div>
        
        {/* 提供快捷入口 */}
        <div className="flex gap-3">
          <Link href="/tools/task-breaker" className="bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Task Breaker
          </Link>
          <Link href="/tools/breathing" className="bg-stone-100 text-stone-700 hover:bg-stone-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Breathing
          </Link>
        </div>
      </div>

      {/* 🌟 你的绝美图表现在安安稳稳地躺在这个 Tool 总控台了！ */}
      <Dashboard />
    </div>
  );
}