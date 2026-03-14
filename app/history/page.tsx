import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import Link from 'next/link';
import { CheckCircle2, Clock, Target, ArrowRight, BookOpen } from 'lucide-react';
// 🌟 新增：引入我们刚刚写好的图表组件
import Dashboard from '@/components/Dashboard';

// 🌟 新增：强制 Next.js 每次访问此页面时都实时查询数据库，禁用页面缓存
export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  // 1. 在服务端验证用户身份
  const { userId } = await auth();

  // 如果未登录，直接重定向到首页
  if (!userId) {
    redirect('/');
  }

  // 2. 从数据库查询当前用户的所有历史任务，按时间倒序排列 (最新的在最前面)
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full max-w-4xl mx-auto pt-16 pb-24 px-4 sm:px-6">
      
      {/* 页面头部 */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-teal-600" />
            Your Action History
          </h1>
          <p className="text-stone-500 mt-2 text-lg">
            Look at all the massive tasks you've conquered and broken down.
          </p>
        </div>
      </div>

      {/* 🌟 核心插入点：在这里渲染炫酷的数据仪表盘图表 */}
      <Dashboard />

      {/* 空状态展示 (如果没有历史记录) */}
      {tasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm">
          <Target className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-stone-900 mb-2">No tasks broken down yet</h3>
          <p className="text-stone-500 mb-6">It's time to tackle your first overwhelming project.</p>
          <Link href="/tools/task-breaker">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center">
              Go to Task Breaker <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </Link>
        </div>
      ) : (
        /* 任务瀑布流展示 */
        <div className="grid gap-6">
          {tasks.map((task: any) => {
            // 安全地解析 JSON 字符串
            let steps: string[] = [];
            try {
              steps = JSON.parse(task.steps);
            } catch (e) {
              console.error("Failed to parse steps for task", task.id);
            }

            // 格式化日期 (如: Oct 24, 2023)
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }).format(new Date(task.createdAt));

            return (
              <div 
                key={task.id} 
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:border-teal-300 hover:shadow-md transition-all duration-300"
              >
                {/* 任务卡片头部：原始任务 + 时间 */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
                  <h2 className="text-xl font-semibold text-stone-900 leading-tight flex-1">
                    {task.originalTask}
                  </h2>
                  <div className="flex items-center text-stone-400 text-sm font-medium shrink-0 bg-stone-50 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {formattedDate}
                  </div>
                </div>

                {/* 拆解步骤列表 */}
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="mt-0.5 text-stone-300 group-hover:text-teal-500 transition-colors shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <p className="text-stone-600 group-hover:text-stone-900 transition-colors leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}