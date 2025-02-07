'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Heart, Share2, MessageCircle, ArrowLeft, Timer, Volume2, VolumeX } from 'lucide-react';

const quizData = [
  {
    id: 1,
    videoUrl: "/videos/quiz1.mp4",
    thumbnail: "/thumbnails/quiz1.jpg",
    question: "What happens next in this scene?",
    options: [
      "The car explodes",
      "He makes the jump",
      "The bridge collapses",
      "A helicopter appears"
    ],
    correctAnswer: 1,
    category: "Action Movies"
  },
  // Add more questions...
];

export default function SoloQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const router = useRouter();

  // Handle video play on user interaction
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => console.log("Video autoplay failed:", error));
    }
  }, [currentQuestion]);

  // Auth check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push('/');
    });
    return () => unsubscribe();
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswerSelection(-1);
    }
  }, [timeLeft, isAnswered]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleAnswerSelection = (index) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswer(index);
    setShowFeedback(true);

    if (index === quizData[currentQuestion].correctAnswer) {
      setScore(score + 100);
    }

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(curr => curr + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowFeedback(false);
        setTimeLeft(10);
      } else {
        router.push('/dashboard/game/solo/results');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Video Container with Fixed Aspect Ratio */}
      <div className="relative h-full w-full flex justify-center bg-black">
        <div className="relative w-full max-w-[calc(100vh*9/16)] h-full">
          {/* Video Player */}
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              playsInline
              loop
              muted={isMuted}
              poster={quizData[currentQuestion].thumbnail}
              className="w-full h-full object-contain"
            >
              <source src={quizData[currentQuestion].videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
          </div>

          {/* Top Bar */}
          <div className="absolute top-safe left-0 right-0 p-4 flex items-center justify-between z-10">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <Timer className="w-4 h-4 text-[#00BFFF]" />
              <span className="font-medium">{timeLeft}s</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-2 rounded-full bg-black/50 backdrop-blur-sm"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              <div className="p-2 rounded-full bg-black/50 backdrop-blur-sm">
                <span className="font-medium">{score}</span>
              </div>
            </div>
          </div>

          {/* Side Actions */}
          <div className="absolute right-4 top-1/3 flex flex-col items-center space-y-6 z-10">
            <button className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Question and Options */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            {/* Category */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-[#00BFFF]/20 text-[#00BFFF] rounded-full text-sm backdrop-blur-sm">
                {quizData[currentQuestion].category}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold mb-6 text-white">
              {quizData[currentQuestion].question}
            </h2>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-3">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(index)}
                  disabled={isAnswered}
                  className={`p-3 rounded-xl backdrop-blur-sm border-2 transition-all duration-300
                    ${isAnswered && showFeedback
                      ? index === quizData[currentQuestion].correctAnswer
                        ? 'bg-green-500/20 border-green-500 text-white'
                        : index === selectedAnswer
                        ? 'bg-red-500/20 border-red-500 text-white'
                        : 'bg-black/50 border-transparent text-white/50'
                      : 'bg-black/50 border-transparent hover:border-[#00BFFF] hover:bg-[#00BFFF]/20'
                    }
                    disabled:cursor-not-allowed text-sm font-medium text-left`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-white/10 rounded-full h-1">
              <div 
                className="h-full bg-[#00BFFF] rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}