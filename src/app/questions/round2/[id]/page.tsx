"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";

const questions = [
  `How would you describe yourself? List five words that describe you.`,
  `How do you usually handle stress or pressure?`,
  `What kind of situations bring out the best in you?`,
  `What is something small about yourself that you think defines you?`,
  `If you had to compare yourself to an animal, which one would it be and why?`,
  `What is your favorite part of yourself?`,
  `Whatis your least favorite part of yourself?`,
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
  const [words, setWords] = useState<string[]>(Array(5).fill(""));

  // Load previous answer if it exists
  useEffect(() => {
    const savedAnswers = localStorage.getItem("round2Answers");
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      if (isFirstQuestion) {
        const savedWords =
          answers[questionNumber - 1]?.answer?.split(", ") || Array(5).fill("");
        setWords(savedWords);
      } else {
        setAnswer(answers[questionNumber - 1]?.answer || "");
      }
    }
  }, [questionNumber]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentAnswer = {
      question: currentQuestion,
      answer: isFirstQuestion ? words.join(", ") : answer,
    };

    // Save to localStorage
    const savedAnswers = localStorage.getItem("round2Answers");
    const allAnswers = savedAnswers ? JSON.parse(savedAnswers) : [];
    allAnswers[questionNumber - 1] = currentAnswer;
    localStorage.setItem("round2Answers", JSON.stringify(allAnswers));

    if (isLastQuestion) {
      try {
        console.log("Sending answers to API:", allAnswers); // Debug log

        const response = await fetch("/api/analyze/round2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: allAnswers }),
        });

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        if (!response.ok) {
          console.error("API Error:", data.error);
          window.location.href = "/questions/summary";
          return;
        }

        localStorage.setItem("round2Keywords", JSON.stringify(data.keywords));
        console.log("Saved keywords:", data.keywords); // Debug log
        window.location.href = "/questions/summary";
      } catch (error) {
        console.error("Failed to analyze answers:", error);
        window.location.href = "/questions/summary";
      }
    } else {
      window.location.href = `/questions/round2/${questionNumber + 1}`;
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-[#B4DAF9]">
      <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8 pt-12 sm:pt-16">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Question {questionNumber} of {questions.length}
          </p>
          <div className="w-full bg-white h-2 rounded-full mt-2">
            <div
              className="bg-[#D0E8FB] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <label className="block text-gray-800 font-medium mb-3">
              {currentQuestion}
            </label>

            {isFirstQuestion ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex items-center">
                    <span className="text-sm text-gray-500 w-6">{num}.</span>
                    <input
                      type="text"
                      value={words[num - 1]}
                      onChange={(e) => {
                        const newWords = [...words];
                        newWords[num - 1] = e.target.value;
                        setWords(newWords);
                      }}
                      className="flex-1 p-3 border border-[#D0E8FB] rounded-lg focus:ring-2 focus:ring-[#D0E8FB] focus:border-transparent"
                      placeholder="Enter word..."
                      required
                      maxLength={20}
                      pattern="\S+"
                      title="Please enter a single word"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-3 border border-[#D0E8FB] rounded-lg focus:ring-2 focus:ring-[#D0E8FB] focus:border-transparent"
                rows={6}
                placeholder="Take your time to reflect..."
                required
                autoFocus
              />
            )}
          </div>

          <div className="flex justify-between mt-6 sm:mt-8">
            <Link
              href={
                questionNumber === 1
                  ? "/questions/round1/12" // Link back to last question of round 1
                  : `/questions/round2/${questionNumber - 1}`
              }
              className={`px-5 py-2.5 bg-[#D0E8FB] text-[#212429] hover:bg-[#E0F0FD] rounded-full transition-colors shadow-lg ${
                isFirstQuestion ? "invisible" : ""
              }`}
            >
              ← Previous
            </Link>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#D0E8FB] text-[#212429] hover:bg-[#E0F0FD] rounded-full transition-colors shadow-lg"
            >
              {isLastQuestion ? "See Results →" : "Next →"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
