import Link from "next/link";
import { ArrowRight, Brain, Wind, ListTodo, Sparkles } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col w-full items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-medium mb-8 border border-teal-100 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>Designed specifically for the ADHD brain</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight mb-8 leading-[1.1]">
          Stop freezing. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
            Start moving.
          </span>
        </h1>
        
        <p className="text-xl text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          MindClear uses AI to break your overwhelming tasks into tiny, 10-minute micro-steps. Say goodbye to executive dysfunction and hello to getting things done.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {userId ? (
            <Link href="/tools" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-medium rounded-2xl text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-medium rounded-2xl text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Start for free <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </SignInButton>
          )}
          <Link href="/blog" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-medium rounded-2xl text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all">
            Read our methodology
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white border-t border-stone-100 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Tools that actually work for you
            </h2>
            <p className="text-stone-500 text-lg">No complex planners, no toxic productivity guilt. Just what you need in the moment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-teal-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">AI Task Breaker</h3>
              <p className="text-stone-500 leading-relaxed">
                Paste a scary project. Get back 3-5 ridiculously small, actionable steps that take less than 10 minutes each.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-teal-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">4-7-8 Breathing</h3>
              <p className="text-stone-500 leading-relaxed">
                A simple, visual breathing guide to quickly lower cortisol and snap you out of ADHD paralysis.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-teal-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                <ListTodo className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Action History</h3>
              <p className="text-stone-500 leading-relaxed">
                Look back at the mountains you've conquered. Build dopamine and momentum by seeing your past wins.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}