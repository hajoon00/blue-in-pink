"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

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

export default function LandingPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto space-y-8 sm:space-y-12 pt-12 sm:pt-16">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/logo.svg"
            alt="Blue in Pink Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>

        {/* Introduction */}
        <div className="space-y-6">
          <p className="text-gray-600 text-lg leading-relaxed">
            BLUE IN PINK is a personality exploration project that reflects two
            different sides of how others might perceive you and how you see
            yourself.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            Through a series of questions, we&apos;ll create a unique personal
            Wordcloud that visualizes this duality using the colors blue and
            pink.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            But please note, this is not a scientific personality test.
            It&apos;s a fun way to explore your personality and see how others
            might see you.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            Both sides are equally important and you don&apos;t have to be one
            or the other.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            Again, this is for fun so I hope you enjoy it!
          </p>
        </div>

        {/* Read More Button */}
        <div className="text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800 underline text-sm"
          >
            {isExpanded ? "Read Less" : "Read More About This Project"}
          </button>
        </div>

        {/* Collapsible Project Background */}
        {isExpanded && (
          <div className="space-y-6 text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-lg">
            <h2 className="font-['Octarine_Bold'] text-xl text-gray-800">
              This project stems from two main ideas
            </h2>

            <div className="space-y-6">
              <section>
                <h3 className="font-['Octarine_Bold'] text-lg text-gray-800 mb-2">
                  1. The MBTI Craze in Korea
                </h3>
                <p>
                  MBTI, or the Myers-Briggs Type Indicator, is a personality
                  assessment that categorizes people into 16 personality types
                  based on four key dichotomies. In Korea, the MBTI personality
                  test is used almost like astrology in the U.S. However, unlike
                  astrology, MBTI requires individuals to take an actual test,
                  making it somewhat more grounded.
                </p>
                <p className="mt-2">
                  All my friends insist that my test results must be wrong when
                  they get to know mine. However, no matter how many times I
                  take the test, I always get the same result. This made me have
                  this thought: perhaps the way I perceive myself and the way
                  others see me are completely different.
                </p>
              </section>

              <section>
                <h3 className="font-['Octarine_Bold'] text-lg text-gray-800 mb-2">
                  2. My White Turkish Angora, Hasom
                </h3>
                <p>
                  I have a Turkish Angora cat named Hasom. He is covered in pure
                  white fur, but underneath, his skin is actually pink, and his
                  eyes are a striking sky blue. Many of my friends assume he
                  must be elegant and aloof, but in reality, he is nothing like
                  that. Again, this reflects the idea that outward appearance
                  doesn&apos;t always match inner personality. This led me to
                  think: what if Hasom&apos;s pink skin (how others see him) and
                  his blue eyes (how he sees the world) could visually express
                  this concept?
                </p>
              </section>

              <section>
                <h3 className="font-['Octarine_Bold'] text-lg text-gray-800 mb-2">
                  About This Project
                </h3>
                <p>
                  This project was created with the help of OpenAI. Based on a
                  few key characteristics, AI will try to predict what kind of
                  person you might be.
                </p>
                <p className="mt-2">
                  As mentioned earlier, PINK represents how others see you,
                  while BLUE represents how you see yourself.
                </p>
                <p className="mt-2">
                  The goal of this project is not to compare the two. I believe
                  that both perspectives are essential parts of our identity.
                </p>
                <p className="mt-2">
                  I hope you enjoy participating in this project and take a
                  moment to reflect on your own identity in the process.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="text-center pt-6">
          <Link
            href="/start"
            className="px-8 py-3 bg-[#FFDCE1] text-gray-700 hover:bg-[#B4DAF9] rounded-full transition-colors shadow-lg inline-block"
          >
            Begin Journey
          </Link>
        </div>
      </div>
    </main>
  );
}
