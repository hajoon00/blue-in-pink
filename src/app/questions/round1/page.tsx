import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Round 1 | Blue in Pink",
  description: "First round of questions - Blue in Pink",
};

export default function Round1() {
  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-pink-100 to-blue-100">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pink-600">Round 1</h1>
          <p className="text-gray-600 mt-4">
            You&apos;re about to begin the first round of questions. Take your
            time to reflect deeply on each question.
          </p>
          <p className="text-gray-600 mt-2">
            There will be 12 questions in this round.
          </p>
        </div>

        <div className="flex justify-between pt-8">
          <Link
            href="/"
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Back
          </Link>
          <Link
            href="/questions/round1/1"
            className="px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg"
          >
            Start Round 1 →
          </Link>
        </div>
      </div>
    </main>
  );
}
