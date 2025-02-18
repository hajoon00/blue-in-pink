import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { answers } = await request.json();

    // Format Q&A for OpenAI
    const formattedQA = answers.map((qa: any) => 
      `Question: ${qa.question}\nAnswer: ${qa.answer}`
    ).join("\n\n");

    const prompt = `Here is a list of questions and answers from a person about their daily life and habits:

${formattedQA}

Based on these responses, generate exactly 10 words that would describe this person's personality traits.
Return only the keywords as a comma-separated list.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 100,
    });

    const keywords = completion.choices[0].message.content?.split(",").map(k => k.trim()) || [];

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error("Failed to analyze answers:", error);
    return NextResponse.json(
      { error: "Failed to analyze answers" },
      { status: 500 }
    );
  }
} 