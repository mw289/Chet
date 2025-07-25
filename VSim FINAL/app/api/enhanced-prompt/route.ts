import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { topic, key_concepts, key_variables, simulation_goals, user_level } = await req.json()

    // Validate required fields
    const requiredFields = ["topic", "key_concepts", "key_variables", "simulation_goals", "user_level"]
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const result = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.2,
      prompt: `Create a comprehensive, detailed prompt for generating a ${user_level}-friendly educational physics simulation.

Topic: ${topic}
Physics concepts: ${Array.isArray(key_concepts) ? key_concepts.join(", ") : key_concepts}
Key variables: ${Array.isArray(key_variables) ? key_variables.join(", ") : key_variables}
Simulation goals: ${Array.isArray(simulation_goals) ? simulation_goals.join(", ") : simulation_goals}
User Level: ${user_level}

Generate a comprehensive prompt that includes:

1. **Technical Implementation Details:**
   - Specific p5.js or matter.js functions to use
   - Canvas setup and drawing requirements
   - Physics calculations and formulas needed
   - Animation and interaction patterns

2. **Educational Requirements:**
   - Learning objectives for ${user_level} students
   - Key physics concepts to highlight visually
   - Common misconceptions to address
   - Real-world connections to make

3. **Interactive Elements:**
   - Specific UI controls needed (sliders, buttons, checkboxes)
   - Real-time feedback and value displays
   - User interaction patterns
   - Reset and control functionality

4. **Visual Design Guidelines:**
   - Color coding for different physics concepts
   - Clear labeling and annotation requirements
   - Graph and chart specifications
   - Visual hierarchy and layout

5. **Physics Accuracy Requirements:**
   - Mathematical precision needed
   - Units and measurement displays
   - Error handling for edge cases
   - Realistic parameter ranges

6. **User Experience Considerations:**
   - Intuitive control placement
   - Clear instructions and help text
   - Progressive disclosure of complexity
   - Accessibility considerations

This enhanced prompt should be detailed enough for a developer to implement the simulation without additional clarification.`,
    })

    return NextResponse.json({
      enhanced_prompt: result.text,
      structured_data: {
        topic,
        key_concepts,
        key_variables,
        simulation_goals,
        user_level,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
