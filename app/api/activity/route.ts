import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { type, duration, completed } = body;

    // 将用户行为写入 ActivityLog 表
    const log = await prisma.activityLog.create({
      data: {
        userId,
        type, 
        duration, 
        completed,
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("[ACTIVITY_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}