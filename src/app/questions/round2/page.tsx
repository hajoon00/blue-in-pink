"use client";

import Link from "next/link";

export default function Round2Start() {
  return (
    <main className="min-h-screen p-4 sm:p-6 bg-[#B4DAF9] flex justify-center items-center">
      <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 font-['Octarine_Bold']">
            Round 2
          </h1>
          <p className="text-gray-600 mt-4">
            You&apos;re about to begin the second round of questions. Take your
            time to reflect deeply on each question.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <p className="text-gray-600">
            In this round, we'll ask you questions about your self-perception
            and personal traits. Your answers will help create a more complete
            picture of your personality.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/questions/round2/1"
            className="px-8 py-3 bg-[#D0E8FB] text-[#212429] hover:bg-[#E0F0FD] rounded-full transition-colors shadow-lg inline-block"
          >
            Start Round 2 →
          </Link>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mt-2">
            Let&apos;s explore how you see yourself.
          </p>
        </div>
      </div>
    </main>
  );
}
