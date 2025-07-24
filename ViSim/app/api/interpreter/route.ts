import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 })
    }

    const result = await generateText({
      model: openai("gpt-4o"),
      temperature: 0,
      prompt: `You are a code validator for educational JavaScript simulations using p5.js.

Validate and fix this code:

\`\`\`javascript
${code}
\`\`\`

Your job:
1. Detect syntax errors or missing structure (setup(), draw() functions)
2. Fix common issues (undeclared variables, missing canvas, typos)
3. Ensure code is safe (no eval(), innerHTML, dangerous functions)
4. Verify proper p5.js structure and interactive controls work
5. Fix bugs that would prevent simulation from running

Respond with:
- ✅ The corrected JavaScript code if valid/fixable
- ❌ Clear error message starting with "ERROR:" if unfixable

Output ONLY code or error message, no explanations.`,
    })

    const isError = result.text.trim().startsWith("ERROR:") || result.text.trim().startsWith("❌")

    return NextResponse.json({
      code: isError ? null : result.text,
      error: isError ? result.text : null,
      original_code: code,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
