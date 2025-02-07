'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { User, Users, Trophy, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleModeSelect = (mode) => {
    if (mode === 'solo') {
      router.push('/dashboard/game/solo/quiz');
    } else if (mode === 'multiplayer') {
      router.push('/dashboard/game/multiplayer/quiz');
    }
  };
  
  if (!user) return null;

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
        {/* Profile Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#00BFFF] group">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#00BFFF]/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#00BFFF]" />
                </div>
              )}
              <div className="absolute inset-0 bg-[#00BFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Welcome, {user.displayName || 'Player'}
              </h2>
              <p className="text-sm text-[#00BFFF]/70">Level 1 Quizzer</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-6 h-6 text-[#00BFFF]" />
          </button>
        </div>

        {/* Game Modes */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-8">Select Game Mode</h3>
          
          {/* Solo Mode */}
          <button
            onClick={() => handleModeSelect('solo')}
            className="w-full bg-transparent relative group overflow-hidden
            border-2 border-[#00BFFF] rounded-2xl p-6
            transition-all duration-300 hover:bg-[#00BFFF]/5"
          >
            <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-15 group-hover:animate-shine"/>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BFFF]/20 to-[#4169E1]/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#00BFFF]" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-lg font-semibold mb-1">Solo Mode</h4>
                <p className="text-sm text-[#00BFFF]/70">Challenge yourself and climb the leaderboard</p>
              </div>
            </div>
          </button>

          {/* Multiplayer Mode */}
          <button
            onClick={() => handleModeSelect('multiplayer')}
            className="w-full bg-transparent relative group overflow-hidden
            border-2 border-[#4169E1] rounded-2xl p-6
            transition-all duration-300 hover:bg-[#4169E1]/5"
          >
            <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-15 group-hover:animate-shine"/>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4169E1]/20 to-[#00BFFF]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#4169E1]" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-lg font-semibold mb-1">Multiplayer Mode</h4>
                <p className="text-sm text-[#4169E1]/70">Compete with friends in real-time</p>
              </div>
            </div>
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-auto pt-12">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '0', label: 'Games' },
              { value: '0', label: 'Wins' },
              { value: '0', label: 'Points' },
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="relative">
                  <div className="text-lg font-bold text-[#00BFFF] transition-all duration-300 group-hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="absolute -inset-1 bg-[#00BFFF] opacity-0 group-hover:opacity-25 blur-lg transition-opacity duration-300"/>
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