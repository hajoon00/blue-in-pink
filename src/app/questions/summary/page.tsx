"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Text } from "@visx/text";
import { Wordcloud } from "@visx/wordcloud";
// import { scaleLog } from "@visx/scale";

type Keywords = {
  round1: string[];
  round2: string[];
};

interface WordData {
  text: string;
  value: number;
  id: string;
  source: "name" | "round1" | "round2";
}

const colors = {
  name: {
    pink: "#FFDCE1",
    blue: "#B4DAF9",
    sage: "#C8DAC2",
    peach: "#FFD4C2",
    lilac: "#E2D4F3",
    mint: "#C2E6E1",
    coral: "#FFD4D4",
  },
  round1: "#B4DAF9",
  round2: "#FFDCE1",
};

// At the top of the file, add the font as base64
// const OCTARINE_BOLD_BASE64 = ""; // You'll need to add the base64 string of your font file here

// Function to get word frequency
// function getWordFrequency(words: string[]): { [key: string]: number } {
//   return words.reduce((acc, word) => {
//     acc[word] = (acc[word] || 0) + 1;
//     return acc;
//   }, {} as { [key: string]: number });
// }

// Add this back near the top of the file
function getRandomRotation() {
  return Math.floor(Math.random() * 181) - 90; // Random angle between -90 and 90
}

// Add this check
const isBrowser = typeof window !== "undefined";

export default function Summary() {
  // Move all hooks to the top, before any other code
  const [keywords, setKeywords] = useState<Keywords>({
    round1: [],
    round2: [],
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userColor, setUserColor] = useState<keyof typeof colors.name>("blue");

  useEffect(() => {
    if (!isBrowser) return;

    try {
      const savedName = localStorage.getItem("userName") || "there";
      const savedColor =
        (localStorage.getItem("userColor") as keyof typeof colors.name) ||
        "blue";
      setUserName(savedName);
      setUserColor(savedColor);
      const round1Keywords = JSON.parse(
        localStorage.getItem("round1Keywords") || "[]"
      );
      const round2Keywords = JSON.parse(
        localStorage.getItem("round2Keywords") || "[]"
      );

      setKeywords({
        round1: round1Keywords,
        round2: round2Keywords,
      });
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Move cloudDimensions after all hooks
  const cloudDimensions = {
    width: 400,
    height: 500,
  };

  // Prepare data for word cloud with name and repeated words
  const words: WordData[] = [];

  // Add name 5 times with varying sizes
  for (let i = 0; i < 5; i++) {
    words.push({
      text: userName,
      value:
        i === 0
          ? 80 // First instance (really big)
          : i === 1
          ? 60 // Second instance (big)
          : i === 2
          ? 40 // Third instance (medium)
          : 20 + Math.random() * 5, // Last two instances (really small)
      id: `name-${i}`,
      source: "name" as const,
    });
  }

  // Add each round1 word 5 times
  keywords.round1.forEach((word) => {
    for (let i = 0; i < 5; i++) {
      words.push({
        text: word,
        value:
          i === 0
            ? 60 // First instance (really big)
            : i === 1
            ? 45 // Second instance (big)
            : i === 2
            ? 30 // Third instance (medium)
            : 15 + Math.random() * 5, // Last two instances (really small)
        id: `round1-${word}-${i}`,
        source: "round1" as const,
      });
    }
  });

  // Add each round2 word 5 times
  keywords.round2.forEach((word) => {
    for (let i = 0; i < 5; i++) {
      words.push({
        text: word,
        value:
          i === 0
            ? 60 // First instance (really big)
            : i === 1
            ? 45 // Second instance (big)
            : i === 2
            ? 30 // Third instance (medium)
            : 15 + Math.random() * 5, // Last two instances (really small)
        id: `round2-${word}-${i}`,
        source: "round2" as const,
      });
    }
  });

  // Shuffle the words array for better distribution
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  const handleDownload = async () => {
    const element = document.getElementById("wordcloud-container");
    if (!element) return;

    try {
      document.body.style.cursor = "wait";

      // Get SVG data
      const svgData = element.innerHTML;
      const svgBlob = new Blob(
        [
          `
        <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
          <style>
            text {
              font-family: 'Octarine Bold', Arial, sans-serif;
              font-weight: bold;
            }
          </style>
          <rect width="100%" height="100%" fill="white"/>
          ${svgData}
        </svg>
      `,
        ],
        { type: "image/svg+xml;charset=utf-8" }
      );

      // Convert SVG to Image
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.src = url;

      await new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 800; // 2x size for better quality
          canvas.height = 1000;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const link = document.createElement("a");
          link.download = `${userName}-wordcloud.jpg`;
          link.href = canvas.toDataURL("image/jpeg", 1.0);
          link.click();

          URL.revokeObjectURL(url);
          resolve(null);
        };
      });
    } catch (error) {
      console.error("Failed to download:", error);
    } finally {
      document.body.style.cursor = "default";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-[#FFDCE1] to-[#B4DAF9] flex justify-center items-center">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-[#FFDCE1] to-[#B4DAF9] flex justify-center items-center">
      <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 font-['Octarine_Bold']">
            {userName}&apos;s BLUE IN PINK
          </h1>
          <p className="text-gray-600 mt-2">
            Based on your answers, here are 20 keywords that describe your
            personality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Round 1 Keywords */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="mb-4">
              <span className="block text-xl font-semibold text-gray-800 font-['Octarine_Bold']">
                BLUE
              </span>
              <span className="block text-sm text-gray-500 mt-1">
                OTHER PEOPLE MIGHT THINK OF YOU AS
              </span>
            </h2>
            <div className="space-y-2">
              {keywords.round1.map((keyword, index) => (
                <div key={keyword} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-6">
                    {index + 1}.
                  </span>
                  <span className="px-3 py-1 bg-[#B4DAF9] text-gray-700 rounded-full text-sm w-full">
                    {keyword}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Round 2 Keywords */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="mb-4">
              <span className="block text-xl font-semibold text-gray-800 font-['Octarine_Bold']">
                PINK
              </span>
              <span className="block text-sm text-gray-500 mt-1">
                YOU MIGHT THINK OF YOURSELF AS
              </span>
            </h2>
            <div className="space-y-2">
              {keywords.round2.map((keyword, index) => (
                <div key={keyword} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-6">
                    {index + 1}.
                  </span>
                  <span className="px-3 py-1 bg-[#FFDCE1] text-gray-700 rounded-full text-sm w-full">
                    {keyword}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Word Cloud */}
        <div className="wordcloud-wrapper bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center font-['Octarine_Bold']">
            Your Word Cloud
          </h2>
          <div
            id="wordcloud-container"
            className="bg-white rounded-lg mx-auto overflow-hidden"
            style={{
              width: "min(400px, 100%)",
              height: "min(500px, 125vw)",
            }}
          >
            <div
              style={{ transform: "scale(0.95)", transformOrigin: "center" }}
            >
              <Wordcloud
                words={shuffledWords}
                width={cloudDimensions.width}
                height={cloudDimensions.height}
                fontSize={(datum) => datum.value * 0.5}
                padding={6}
                rotate={() => getRandomRotation()}
                spiral="rectangular"
                font={"Octarine Bold"}
                random={() => 0.5}
              >
                {(cloudWords) =>
                  cloudWords.map((w, i) => (
                    <Text
                      key={`${w.text}-${i}`}
                      fill={
                        (w.text || "") === userName
                          ? colors.name[userColor]
                          : keywords.round1.includes(w.text || "")
                          ? colors.round1
                          : colors.round2
                      }
                      textAnchor="middle"
                      transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                      fontSize={w.size}
                      fontFamily={"Octarine Bold"}
                      style={{
                        transition: "all 0.3s ease",
                        cursor: "default",
                        opacity: 0.8 + (w.size ?? 30) / 100,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {w.text}
                    </Text>
                  ))
                }
              </Wordcloud>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4 space-x-4">
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 bg-white text-gray-700 hover:bg-gray-50 rounded-full transition-colors shadow-lg inline-block mb-4"
          >
            Download
          </button>

          <Link
            href="/"
            className="px-6 py-2.5 bg-white text-gray-700 hover:bg-gray-50 rounded-full transition-colors shadow-lg inline-block"
          >
            Start Over
          </Link>
        </div>
      </div>
    </main>
  );
}
