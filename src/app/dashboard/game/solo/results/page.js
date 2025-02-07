'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Trophy, Star, Share2, ArrowLeft, Award, Flame, BarChart3 } from 'lucide-react';
import Image from 'next/image';

export default function QuizResults() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  // Mock results - replace with actual quiz results
  const results = {
    score: 800,
    correctAnswers: 8,
    totalQuestions: 10,
    timeSpent: "2:30",
    streak: 5,
    rank: 234,
    xpGained: 150
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/');
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white font-[Inter] overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00BFFF] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-float-slow"/>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#4169E1] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-float-delay"/>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-20"/>
      </div>

      {/* Content Container */}
      <div className="relative max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Score Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <div className="absolute -inset-4 bg-yellow-500 opacity-25 blur-xl -z-10 animate-pulse-slow"/>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {results.score}
            <span className="text-[#00BFFF]"> pts</span>
          </h1>
          <p className="text-gray-400">
            {results.correctAnswers} out of {results.totalQuestions} correct
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Time Spent', value: results.timeSpent, icon: BarChart3 },
            { label: 'Best Streak', value: results.streak, icon: Flame },
            { label: 'Global Rank', value: `#${results.rank}`, icon: Trophy },
            { label: 'XP Gained', value: `+${results.xpGained}`, icon: Star },
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10
              hover:border-[#00BFFF]/50 transition-colors group"
            >
              <stat.icon className="w-5 h-5 text-[#00BFFF] mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievement */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#00BFFF]/20">
              <Award className="w-6 h-6 text-[#00BFFF]" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Quiz Master</h3>
              <p className="text-sm text-gray-400">Complete 10 quizzes with 80%+ accuracy</p>
            </div>
          </div>
          <div className="mt-3 bg-white/10 rounded-full h-2">
            <div 
              className="h-full bg-[#00BFFF] rounded-full transition-all duration-300"
              style={{ width: '80%' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mt-auto">
          <button
            onClick={() => router.push('/dashboard/game/solo/quiz')}
            className="w-full bg-gradient-to-r from-[#00BFFF] to-[#4169E1] text-white
            rounded-xl py-4 font-medium hover:opacity-90 transition-opacity"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-white/10 backdrop-blur-sm text-white
            rounded-xl py-4 font-medium hover:bg-white/20 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}


