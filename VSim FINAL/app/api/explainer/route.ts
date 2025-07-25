import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const ExplainerSchema = z.object({
  explanations: z.array(
    z.object({
      location: z.object({
        x: z.union([z.number(), z.string()]),
        y: z.union([z.number(), z.string()]),
      }),
      text: z.string(),
      condition: z.string().optional(),
      type: z.enum(["tooltip", "annotation", "label"]),
    }),
  ),
  code_injections: z.array(
    z.object({
      location: z.enum(["setup", "draw", "class"]),
      code: z.string(),
      description: z.string(),
    }),
  ),
})

export async function POST(req: NextRequest) {
  try {
    const { code, topic, key_concepts } = await req.json()

    if (!code || !topic || !key_concepts) {
      return NextResponse.json(
        {
          error: "Missing required fields: code, topic, key_concepts",
        },
        { status: 400 },
      )
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: ExplainerSchema,
      temperature: 0.3,
      prompt: `You are an educational physics simulation expert. Analyze this p5.js code and generate educational explanations and annotations.

Topic: ${topic}
Key Physics Concepts: ${Array.isArray(key_concepts) ? key_concepts.join(", ") : key_concepts}

Analyze this p5.js code:

\`\`\`javascript
${code}
\`\`\`

Generate educational overlays that can be injected into the simulation:

Requirements:
- Create explanations for key physics concepts visible in the code
- Add tooltips for interactive elements (sliders, buttons, controls)
- Include real-time value displays for important physics variables
- Explain energy transformations, forces, motion, or other physics phenomena
- Make explanations scientifically accurate but accessible
- Position explanations near relevant visual elements using x,y coordinates
- Use JavaScript conditions to show explanations at appropriate times
- Add code injections for educational displays (graphs, value readouts, labels)
- Focus on helping users understand the physics behind what they see

Examples of good explanations:
- "Kinetic Energy = ½mv²" with real-time calculation display
- "As the pendulum swings, potential energy converts to kinetic energy"
- "Gravity acceleration = 9.8 m/s²" shown near falling objects
- "Velocity vector" with arrow showing direction and magnitude`,
    })

    return NextResponse.json({
      explanations: result.object,
      original_code: code,
      topic,
      key_concepts,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
