import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Answer {
  question: string;
  answer: string;
}

export async function POST(request: Request) {
  try {
    const { answers }: { answers: Answer[] } = await request.json();
    
    // Format Q&A for OpenAI
    const formattedQA = answers.map((qa: any) => 
      `Question: ${qa.question}\nAnswer: ${qa.answer}`
    ).join("\n\n");

    const prompt = `Here is a list of questions and answers from a person about their self-reflection and personality:

${formattedQA}

Based on these responses, generate exactly 10 words that would describe this person's personality traits.
Return only the keywords as a comma-separated list, for example: confident, creative, ambitious, thoughtful, caring, organized, adaptable, curious, resilient, determined`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 100,
    });

    const keywords = completion.choices[0].message.content?.split(",").map(k => k.trim()) || [];

    // Ensure exactly 10 keywords
    if (keywords.length !== 10) {
      console.error("OpenAI did not return exactly 10 keywords:", keywords);
      // Pad or trim to exactly 10 keywords
      while (keywords.length < 10) keywords.push("unknown");
      if (keywords.length > 10) keywords.length = 10;
    }

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error("Failed to analyze answers:", error);
    return NextResponse.json(
      { error: "Failed to analyze answers" },
      { status: 500 }
    );
  }
} 