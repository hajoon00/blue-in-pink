"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";

const questions = [
  "What are you wearing today?",
  "What was the most exciting event you attended recently?",
  "What are you studying?",
  "What&apos;s your favorite class this semester and why?",
  "Have you changed your hairstyle recently? If so, how?",
  "What's one personality trait people often describe you with, but you think it doesn't apply to you?",
  "What&apos;s your favorite hobby or pastime?",
  "What&apos;s your favorite food?",
  "What&apos;s your go-to coffee order?",
  "Do you prefer calling or texting to communicate?",
  "Have you had the same wallpaper on your phone for a long time? Why did you choose it?",
  "How often do you make your bed?",
];

type QuestionParams = {
  params: Promise<{
    id: string;
  }>;
};

export default function Question({ params }: QuestionParams) {
  const resolvedParams = use(params);
  const questionNumber = parseInt(resolvedParams.id);
  const [answer, setAnswer] = useState("");

  // Load previous answer if it exists
  useEffect(() => {
    const savedAnswers = localStorage.getItem("round1Answers");
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      setAnswer(answers[questionNumber - 1]?.answer || "");
    }
  }, [questionNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get existing answers or initialize empty array
    const savedAnswers = localStorage.getItem("round1Answers");
    const answers = savedAnswers ? JSON.parse(savedAnswers) : [];

    // Save the current answer with its question
    answers[questionNumber - 1] = {
      question: questions[questionNumber - 1],
      answer: answer,
    };

    // Save to localStorage
    localStorage.setItem("round1Answers", JSON.stringify(answers));

    // If it's the last question, generate keywords
    if (isLastQuestion) {
      try {
        const response = await fetch("/api/analyze/round1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }), // Sending full Q&A list
        });

        if (!response.ok) throw new Error("Failed to analyze answers");

        const { keywords } = await response.json();
        localStorage.setItem("round1Keywords", JSON.stringify(keywords));
      } catch (error) {
        console.error("Failed to analyze answers:", error);
      }
    }

    // Navigate
    window.location.href = isLastQuestion
      ? "/questions/round2"
      : `/questions/round1/${questionNumber + 1}`;
  };

  // Validate question number
  if (
    isNaN(questionNumber) ||
    questionNumber < 1 ||
    questionNumber > questions.length
  ) {
    notFound();
  }

  const currentQuestion = questions[questionNumber - 1];
  const isLastQuestion = questionNumber === questions.length;
  const isFirstQuestion = questionNumber === 1;
  const prevHref = isFirstQuestion
    ? "/questions/round1"
    : `/questions/round1/${questionNumber - 1}`;

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-[#FFDCE1]">
      <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8 pt-12 sm:pt-16">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Question {questionNumber} of {questions.length}
          </p>
          <div className="w-full bg-white h-2 rounded-full mt-2">
            <div
              className="bg-[#FFADB9] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <label className="block text-gray-800 font-medium mb-3">
              {currentQuestion}
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFADB9] focus:border-transparent"
              rows={6}
              placeholder="Take your time to reflect..."
              required
              autoFocus
            />
          </div>

          <div className="flex justify-between mt-6 sm:mt-8">
            <Link
              href={prevHref}
              className={`px-5 py-2.5 bg-[#FFADB9] text-white hover:bg-[#FFB9C3] rounded-full transition-colors shadow-lg ${
                isFirstQuestion ? "invisible" : ""
              }`}
            >
              ← Previous
            </Link>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#FFADB9] text-white hover:bg-[#FFB9C3] rounded-full transition-colors shadow-lg"
            >
              {isLastQuestion ? "See Round 2 →" : "Next →"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
