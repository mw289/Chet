import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { prompt_text, ui_controls, explanations } = await req.json()

    if (!prompt_text) {
      return NextResponse.json({ error: "Missing prompt_text" }, { status: 400 })
    }

    const result = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.4,
      prompt: `You are a JavaScript simulation expert using p5.js and matter.js libraries.

Write clean, beginner-friendly code based on:

${prompt_text}

UI Controls to integrate:
${ui_controls ? JSON.stringify(ui_controls, null, 2) : "No UI controls provided"}

Educational explanations to add:
${explanations ? JSON.stringify(explanations, null, 2) : "No explanations provided"}

Requirements:
- Choose between p5.js (simple graphics) or matter.js (complex physics)
- Include comments explaining physics concepts
- Make it visually clear and interactive
- Use only p5.js and/or matter.js libraries
- Output only JavaScript code, no explanations
- Use proper setup() and draw() functions
- Integrate ALL provided UI controls
- Add ALL educational explanations as text overlays
- Include reset button and error handling
- Use color coding and labels
- Ensure the simulation runs and responds to input

Respond ONLY with complete JavaScript code.`,
    })

    return NextResponse.json({
      code: result.text,
      prompt: prompt_text,
      ui_controls,
      explanations,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
