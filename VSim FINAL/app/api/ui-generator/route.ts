import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const UIControlsSchema = z.object({
  ui_controls: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      label: z.string(),
      min: z.number().optional(),
      max: z.number().optional(),
      default: z.union([z.string(), z.number(), z.boolean()]),
      step: z.number().optional(),
      position: z.object({ x: z.number(), y: z.number() }),
      description: z.string(),
    }),
  ),
  setup_code: z.string(),
  draw_code: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const { key_variables, simulation_goals, user_level } = await req.json()

    if (!key_variables || !simulation_goals || !user_level) {
      return NextResponse.json(
        {
          error: "Missing required fields: key_variables, simulation_goals, user_level",
        },
        { status: 400 },
      )
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: UIControlsSchema,
      prompt: `Generate p5.js UI controls for a physics simulation.

Key Variables: ${Array.isArray(key_variables) ? key_variables.join(", ") : key_variables}
Simulation Goals: ${Array.isArray(simulation_goals) ? simulation_goals.join(", ") : simulation_goals}
User Level: ${user_level}

Create appropriate controls:
- Sliders for numeric values with proper ranges
- Checkboxes for boolean toggles
- Buttons for actions (reset, start/stop)
- Position controls around canvas edges
- Include clear labels and descriptions
- Make controls appropriate for ${user_level} level

Provide setup_code (createSlider, createButton calls) and draw_code (getting values).`,
    })

    return NextResponse.json(result.object)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
