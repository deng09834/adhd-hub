import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  console.log("\n=== 🚀 开始处理新的拆解请求 ===");
  try {
    // 1. 获取登录状态
    const { userId } = await auth();
    console.log("📍 [节点 1] 获取到的用户 ID:", userId || "未获取到 (null)");
    
    if (!userId) {
      console.log("❌ [错误] 拦截：用户未登录！");
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // 2. 获取前端传来的任务
    const { task } = await req.json();
    console.log("📍 [节点 2] 接收到的原始任务:", task);

    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 });
    }

    // 3. 调用 DeepSeek API
    console.log("📍 [节点 3] 正在请求 DeepSeek API...");
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are an empathetic and professional ADHD productivity coach. The user will provide a complex or overwhelming task.
          Your goal is to break this task down into 3 to 5 extremely small, highly specific, and immediately actionable micro-steps.
          
          Rules:
          1. Each step MUST take NO MORE than 10 minutes to complete.
          2. Keep the tone gentle, encouraging, and clear.
          3. You must append an estimated time at the end of each step, formatted exactly like this: "(5 mins)".
          4. You must return ONLY a strict JSON object containing a single "steps" array. Do NOT wrap the JSON in markdown code blocks.
          
          Expected Output Format:
          {
            "steps": [
              "Clear your desk and close unnecessary browser tabs (2 mins).",
              "Open a blank document and write just the title (1 min)."
            ]
          }`
        },
        {
          role: 'user',
          content: `Help me break down this task: ${task}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    console.log("📍 [节点 4] DeepSeek 成功返回了内容！");
    
    if (content) {
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedContent);
      
      // 4. 存入数据库
      console.log("📍 [节点 5] 正在尝试存入 Prisma 数据库...");
      
      // 保存具体的拆解任务
      const savedTask = await prisma.task.create({
        data: {
          userId: userId,
          originalTask: task,
          steps: JSON.stringify(parsedData.steps),
        }
      });
      console.log("✅ [大成功] 任务数据存入成功！生成的数据库 ID:", savedTask.id);

      // 🌟 新增核心逻辑：悄悄记录一次“任务拆解”操作，用于图表展示
      await prisma.activityLog.create({
        data: {
          userId: userId,
          type: "TASK_BREAKER",
          duration: 0, // 拆解任务按次数算，这里记为 0
          completed: true,
        }
      });
      console.log("✅ [大成功] 活动记录 (ActivityLog) 埋点存入成功！");

      return NextResponse.json({ steps: parsedData.steps });
    } else {
      throw new Error("No content generated");
    }

  } catch (error) {
    console.error('❌ [系统崩溃] 捕捉到严重错误:', error);
    return NextResponse.json(
      { error: 'Failed to break down task. Please try again.' }, 
      { status: 500 }
    );
  }
}