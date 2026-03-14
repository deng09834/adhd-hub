import { getPostData } from '@/lib/blog';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
// 引入刚刚安装的 Markdown 渲染组件
import ReactMarkdown from 'react-markdown';

// 注意这里的 params 接收了 URL 上的动态变量 (slug)
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 使用工具函数读取对应的 Markdown 文件内容
  const postData = getPostData(slug);

  // 格式化日期
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(postData.date));

  return (
    <article className="w-full max-w-3xl mx-auto pt-16 pb-24 px-4 sm:px-6">
      
      {/* 返回按钮 */}
      <Link href="/blog" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Link>

      {/* 文章头部信息 */}
      <header className="mb-12 pb-8 border-b border-stone-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 mb-6 leading-tight">
          {postData.title}
        </h1>
        <div className="flex items-center text-stone-500 font-medium">
          <Calendar className="w-5 h-5 mr-2" />
          {formattedDate}
        </div>
      </header>

      {/* 核心渲染区：
        这里的 prose 系列类名，就是我们之前配置的 @tailwindcss/typography 插件！
        它会把枯燥的 HTML 标签自动排版得像 Medium 文章一样优美。
      */}
      <div className="prose prose-lg prose-stone prose-headings:text-stone-900 prose-a:text-teal-600 hover:prose-a:text-teal-700 max-w-none">
        <ReactMarkdown>
          {postData.content}
        </ReactMarkdown>
      </div>
      
    </article>
  );
}