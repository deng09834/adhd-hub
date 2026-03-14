import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. 获取过去 7 天的数据
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await prisma.activityLog.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo }
      },
      orderBy: { createdAt: 'asc' }
    });

    // 2. 统计总数：拆解过的所有任务数
    const tasksConquered = await prisma.task.count({
      where: { userId }
    });

    // 3. 计算顶部卡片的数据
    const totalUses = logs.length;
    
    // 把呼吸的秒数加起来，换算成分钟
    const totalBreathingSeconds = logs
      .filter(log => log.type === 'BREATHING')
      .reduce((acc, log) => acc + log.duration, 0);
    const totalBreathingMins = Math.floor(totalBreathingSeconds / 60);

    // 4. 按“星期几”分组，生成图表需要的数据格式
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartDataMap = new Map();

    // 先初始化过去 7 天的空模板，保证每天都在图表上显示
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      chartDataMap.set(dayName, { date: dayName, tasks: 0, breathingMins: 0, completed: 0 });
    }

    // 将真实数据填入对应的星期中
    logs.forEach(log => {
      const dayName = days[log.createdAt.getDay()];
      if (chartDataMap.has(dayName)) {
        const dayData = chartDataMap.get(dayName);
        if (log.type === 'TASK_BREAKER') {
          dayData.tasks += 1;
          dayData.completed += 1; // 演示图表效果用
        } else if (log.type === 'BREATHING') {
          dayData.breathingMins += (log.duration / 60); // 累加分钟数
        }
      }
    });

    // 把 Map 转换回图表需要的数组，并保留 1 位小数
    const chartData = Array.from(chartDataMap.values()).map(d => ({
      ...d,
      breathingMins: Math.round(d.breathingMins * 10) / 10
    }));

    return NextResponse.json({
      totalUses,
      totalBreathingMins,
      tasksConquered,
      chartData
    });

  } catch (error) {
    console.error("[DASHBOARD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}