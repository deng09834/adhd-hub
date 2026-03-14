import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'sonner'; // 🌟 新增：引入 Sonner 组件

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindClear | ADHD Task Breaker",
  description: "Break overwhelming tasks into actionable micro-steps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-stone-50 min-h-screen flex flex-col`}>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          {/* 🌟 新增：全局挂载 Toaster，设置位置在顶部中间，并使用丰富的颜色 */}
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}