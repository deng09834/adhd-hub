"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { Activity, Clock, CheckCircle2, Loader2 } from 'lucide-react';

// 定义数据的类型
interface DashboardData {
  totalUses: number;
  totalBreathingMins: number;
  tasksConquered: number;
  chartData: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 组件一加载，立刻去后端请求最新数据
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 数据还在加载时，显示一个优雅的转圈动画
  if (loading || !data) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-200 mb-16 shadow-sm">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
        <p className="text-stone-500 font-medium animate-pulse">Crunching your numbers...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 mb-16 animate-in fade-in duration-700">
      
      {/* 顶部三个核心数据卡片 (现在全是真实数据！) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-stone-500">Total Tool Uses</p>
            <h4 className="text-2xl font-bold text-stone-900">{data.totalUses} times</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-stone-500">Breathing Time</p>
            <h4 className="text-2xl font-bold text-stone-900">{data.totalBreathingMins} mins</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-stone-500">Tasks Conquered</p>
            <h4 className="text-2xl font-bold text-stone-900">{data.tasksConquered} tasks</h4>
          </div>
        </div>
      </div>

      {/* 两张图表区 (使用 API 传回的按天统计的数组) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 左图：使用频率柱状图 */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:border-teal-200 transition-colors">
          <h3 className="text-lg font-bold text-stone-900 mb-6">Activity Frequency</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} dy={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="tasks" name="Task Breaker" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 右图：冥想时长折线图 */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:border-teal-200 transition-colors">
          <h3 className="text-lg font-bold text-stone-900 mb-6">Breathing Duration (Mins)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} dy={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="breathingMins" name="Minutes" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}