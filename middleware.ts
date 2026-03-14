import { clerkMiddleware } from "@clerk/nextjs/server";

// 默认配置：不强制全站登录，允许访客看首页和 Blog，但我们可以后续保护 /tools 路由
export default clerkMiddleware();

export const config = {
  matcher: [
    // 忽略静态文件和 Next.js 内部路由，匹配所有其他路由
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 始终拦截 API 路由以便进行权限校验
    '/(api|trpc)(.*)',
  ],
};