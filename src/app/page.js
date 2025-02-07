'use client'

import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Play, Trophy, Users } from 'lucide-react';
import Image from 'next/image';

const mockVideoPreviews = [
  {
    title: "Inception",
    thumbnail: '/thumbnails/science.jpg',
    question: "What happens in his dream?",
    category: "Sci-Fi",
    difficulty: "Medium"
  },
  {
    title: "Matrix",
    thumbnail: '/thumbnails/history.jpg',
    question: "Blue pill or red pill?",
    category: "Action",
    difficulty: "Hard"
  },
  {
    title: "Interstellar",
    thumbnail: '/thumbnails/math.jpg',
    question: "What's beyond the black hole?",
    category: "Adventure",
    difficulty: "Expert"
  }
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Auto-rotate previews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % mockVideoPreviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle sign in
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-[Inter] overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00BFFF] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-float-slow"/>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#4169E1] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-float-delay"/>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-20"/>
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-md mx-auto px-6 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[15vh] flex flex-col justify-center relative">
          <div className="absolute top-1/2 left-0 w-12 h-[2px] bg-gradient-to-r from-[#00BFFF] to-transparent"/>
          <div className="absolute top-1/2 right-0 w-12 h-[2px] bg-gradient-to-l from-[#00BFFF] to-transparent"/>
          
          <h1 className="text-4xl font-bold text-center relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00BFFF] to-[#4169E1]">
              ReelQuiz
            </span>
            <div className="absolute -inset-1 bg-[#00BFFF] opacity-25 blur-lg -z-10 animate-pulse-slow"/>
          </h1>
          <p className="text-base text-[#00BFFF]/80 text-center mt-1">
            Learn. Watch. Answer.
          </p>
        </header>

        {/* Preview Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 aspect-[9/16] rounded-2xl overflow-hidden group">
            {/* Video Preview */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${mockVideoPreviews[currentVideoIndex].thumbnail})` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black"/>
            <div className="absolute inset-0 bg-[#00BFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            
            {/* Animated border */}
            <div className="absolute inset-0 border-2 border-[#00BFFF]/20 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#00BFFF]/40 to-transparent -translate-x-full animate-shimmer"/>
            </div>
            
            {/* Progress Indicators */}
            <div className="absolute top-4 left-4 right-4 flex gap-2">
              {mockVideoPreviews.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                    index === currentVideoIndex 
                      ? 'bg-gradient-to-r from-[#00BFFF] to-[#4169E1] scale-100' 
                      : 'bg-white/30 scale-90'
                  }`}
                />
              ))}
            </div>
            
            {/* Question Preview */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              <span className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-[#00BFFF]/20 to-[#4169E1]/20 text-[#00BFFF] text-xs font-medium border border-[#00BFFF]/20">
                {mockVideoPreviews[currentVideoIndex].category}
              </span>
              <p className="text-white text-sm font-medium leading-snug">
                {mockVideoPreviews[currentVideoIndex].question}
              </p>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="h-[25vh] flex flex-col justify-center space-y-6">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-transparent relative group overflow-hidden
            border-2 border-[#00BFFF] text-[#00BFFF] font-medium 
            h-12 rounded-xl
            flex items-center justify-center gap-3
            transition-all duration-300
            hover:bg-[#00BFFF] hover:text-black
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
              <div className="absolute inset-0 bg-[#00BFFF] blur-md"/>
            </div>
            
            <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-15 group-hover:animate-shine"/>
            
            {!loading && (
              <img
                src="/google-logo.svg"
                alt="Google"
                className="w-5 h-5 relative transition-transform group-hover:scale-110"
              />
            )}
            <span className="relative">
              {loading ? 'Signing in...' : 'Play Now with Google'}
            </span>
          </button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '1M+', label: 'Players', icon: Users },
              { value: '5K+', label: 'Quizzes', icon: Play },
              { value: '10+', label: 'Awards', icon: Trophy }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <stat.icon className="w-5 h-5 text-[#00BFFF] mb-1 transition-transform group-hover:scale-110" />
                  <div className="text-sm font-bold text-[#00BFFF]">
                    {stat.value}
                  </div>
                  <div className="absolute -inset-2 bg-[#00BFFF] opacity-0 group-hover:opacity-25 blur-lg transition-opacity duration-300"/>
                </div>
                <div className="text-xs text-[#00BFFF]/70 transition-all duration-300 group-hover:text-[#00BFFF]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}