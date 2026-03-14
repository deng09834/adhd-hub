import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export default async function BlogIndex() {
  // 调用我们刚才写的工具函数，读取所有的 Markdown 文章
  const allPostsData = getSortedPostsData();

  return (
    <div className="w-full max-w-4xl mx-auto pt-16 pb-24 px-4 sm:px-6">
      
      {/* 页面头部 */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-2xl mb-4 text-teal-700">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
          MindClear Blog
        </h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Insights, tips, and science-backed strategies to help you navigate life with ADHD.
        </p>
      </div>

      {/* 文章列表 */}
      <div className="grid gap-8 sm:grid-cols-2">
        {allPostsData.map(({ slug, title, date, description }) => {
          // 格式化日期
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }).format(new Date(date));

          return (
            <Link href={`/blog/${slug}`} key={slug} className="group flex flex-col h-full bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:border-teal-300 hover:shadow-md transition-all duration-300">
              <div className="flex-1">
                <div className="flex items-center text-sm text-stone-400 mb-4 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formattedDate}
                </div>
                <h2 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-teal-700 transition-colors line-clamp-2">
                  {title}
                </h2>
                <p className="text-stone-500 leading-relaxed mb-6 line-clamp-3">
                  {description}
                </p>
              </div>
              
              <div className="mt-auto flex items-center text-teal-600 font-medium group-hover:text-teal-700">
                Read article <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
      
    </div>
  );
}