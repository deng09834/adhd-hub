import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* 左侧：Logo */}
        <Link href="/" className="flex items-center gap-2 text-stone-900 font-bold text-xl hover:opacity-80 transition-opacity">
          <Sparkles className="w-6 h-6 text-teal-600" />
          <span>MindClear</span>
        </Link>

        {/* 右侧：导航链接和头像 */}
        <div className="flex items-center gap-6">
          {userId ? (
            // 已登录用户看到的菜单
            <>
              <Link href="/tools" className="text-sm font-medium text-stone-600 hover:text-teal-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/history" className="text-sm font-medium text-stone-600 hover:text-teal-600 transition-colors">
                History
              </Link>
              <Link href="/blog" className="text-sm font-medium text-stone-600 hover:text-teal-600 transition-colors">
                Blog
              </Link>
              {/* Clerk 提供的极简用户头像组件 */}
              <div className="ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            // 未登录用户看到的菜单
            <>
              <Link href="/blog" className="text-sm font-medium text-stone-600 hover:text-teal-600 transition-colors">
                Blog
              </Link>
              <SignInButton mode="modal">
                <button className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
}