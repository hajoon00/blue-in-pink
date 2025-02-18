"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const nameColors = {
  pink: "#FFDCE1", // Main pink
  blue: "#B4DAF9", // Main blue
  sage: "#C8DAC2", // Soft sage green
  peach: "#FFD4C2", // Soft peach
  lilac: "#E2D4F3", // Soft lilac
  mint: "#C2E6E1", // Soft mint
  coral: "#FFD4D4", // Soft coral
} as const;

type NameColor = keyof typeof nameColors;

export default function Start() {
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [selectedColor, setSelectedColor] = useState<NameColor>("blue");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && consent) {
      localStorage.setItem("userName", name);
      localStorage.setItem("userColor", selectedColor);
      localStorage.setItem("userConsent", "true");
      router.push("/questions/round1/1");
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-[#FFDCE1] to-[#B4DAF9]">
      <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 font-['Octarine_Bold']">
            Welcome
          </h1>
          <p className="text-gray-600 mt-2">
            Let's get to know you through a series of questions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-800 font-medium mb-2"
                >
                  What's your first name?
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value.trim())}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFDCE1] focus:border-transparent"
                  placeholder="Enter your first name"
                  required
                  maxLength={15}
                  pattern="[A-Za-z]+"
                  title="Please enter only letters"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Choose your name's color
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {(Object.keys(nameColors) as NameColor[]).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-gray-500 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: nameColors[color] }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    I understand and agree that my answers will be processed by
                    OpenAI to generate personality insights. No personal
                    information will be stored or shared beyond this
                    application.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={!name || !consent}
              className="px-6 py-2.5 bg-[#FFDCE1] text-gray-700 rounded-full 
                hover:bg-[#B4DAF9] transition-colors shadow-lg inline-block
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Questions
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
