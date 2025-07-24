import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { validated_code, structured_data, ui_controls, code_explanations } = await req.json()

    if (!validated_code) {
      return NextResponse.json({ error: "Missing validated_code" }, { status: 400 })
    }

    // Generate sandbox-optimized code
    const sandboxCode = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.2,
      prompt: `You are a Sandbox Code Optimizer for physics simulations.

Take this p5.js physics simulation code and optimize it for real-time preview in a web sandbox:

Original Code:
\`\`\`javascript
${validated_code}
\`\`\`

Simulation Info:
- Topic: ${structured_data?.topic || "Physics Simulation"}
- Level: ${structured_data?.user_level || "beginner"}
- Concepts: ${structured_data?.key_concepts?.join(", ") || "physics"}

Requirements for sandbox optimization:
1. Ensure the canvas size is appropriate for preview (max 600x400)
2. Add error handling to prevent crashes
3. Optimize performance for real-time rendering
4. Add clear visual feedback and labels
5. Ensure all controls are functional and responsive
6. Add a pause/play button for animation control
7. Include FPS display for performance monitoring
8. Add bounds checking to prevent objects from going off-screen
9. Use consistent color schemes and clear typography
10. Add keyboard shortcuts (spacebar for pause, 'r' for reset)

Educational enhancements:
- Display key physics values in real-time
- Add visual indicators for forces, velocities, energies
- Include unit labels and scientific notation where appropriate
- Show equations and formulas relevant to the simulation

Output ONLY the complete, optimized JavaScript code that will run smoothly in a sandbox environment.`,
    })

    // Generate HTML wrapper for the sandbox
    const htmlWrapper = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${structured_data?.topic || "Physics Simulation"} - Sandbox Preview</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #A796CB20 0%, #7962A620 100%);
            color: #333;
            overflow-x: hidden;
        }
        .sandbox-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(121, 98, 166, 0.2);
            border: 1px solid rgba(167, 150, 203, 0.3);
        }
        .simulation-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .simulation-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #7962A6 0%, #A796CB 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: none;
        }
        .simulation-info {
            font-size: 14px;
            color: #7962A6;
            margin-bottom: 15px;
        }
        .concepts-tags {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            margin-bottom: 20px;
        }
        .concept-tag {
            background: linear-gradient(135deg, #A796CB20 0%, #7962A620 100%);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            border: 1px solid #A796CB;
            color: #7962A6;
        }
        .canvas-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        .controls-info {
            background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
            padding: 15px;
            border-radius: 10px;
            font-size: 14px;
            line-height: 1.6;
            border: 1px solid #A796CB30;
        }
        .controls-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #7962A6;
        }
        .error-message {
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.3);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            font-family: monospace;
            color: #dc3545;
        }
        .loading {
            text-align: center;
            padding: 40px;
            font-size: 18px;
            color: #7962A6;
        }
    </style>
</head>
<body>
    <div class="sandbox-container">
        <div class="simulation-header">
            <div class="simulation-title">${structured_data?.topic || "Physics Simulation"}</div>
            <div class="simulation-info">
                Level: ${structured_data?.user_level || "beginner"} | 
                Interactive Physics Sandbox
            </div>
            ${
              structured_data?.key_concepts
                ? `<div class="concepts-tags">
                ${structured_data.key_concepts
                  .map((concept: string) => `<span class="concept-tag">${concept}</span>`)
                  .join("")}
            </div>`
                : ""
            }
        </div>
        
        <div class="canvas-container" id="canvas-container">
            <div class="loading">🔬 Initializing Physics Simulation...</div>
        </div>
        
        <div class="controls-info">
            <div class="controls-title">🎮 Controls & Information</div>
            <div>
                • <strong>Spacebar:</strong> Pause/Resume simulation<br>
                • <strong>R key:</strong> Reset simulation<br>
                • <strong>Mouse:</strong> Interact with objects (drag, click)<br>
                ${
                  ui_controls?.ui_controls?.length > 0
                    ? `• <strong>Sliders & Buttons:</strong> Adjust ${ui_controls.ui_controls
                        .map((control: any) => control.label || control.name)
                        .join(", ")}<br>`
                    : ""
                }
                • <strong>Real-time Values:</strong> Physics calculations displayed on canvas
            </div>
        </div>
    </div>

    <script>
        // Error handling wrapper
        window.addEventListener('error', function(e) {
            const container = document.getElementById('canvas-container');
            container.innerHTML = \`
                <div class="error-message">
                    <strong>⚠️ Simulation Error:</strong><br>
                    \${e.message}<br><br>
                    <small>The simulation encountered an error. This might be due to browser compatibility or code issues.</small>
                </div>
            \`;
        });

        // Initialize simulation
        try {
            ${sandboxCode.text}
        } catch (error) {
            const container = document.getElementById('canvas-container');
            container.innerHTML = \`
                <div class="error-message">
                    <strong>⚠️ Initialization Error:</strong><br>
                    \${error.message}<br><br>
                    <small>Failed to initialize the physics simulation.</small>
                </div>
            \`;
        }
    </script>
</body>
</html>`

    return NextResponse.json({
      success: true,
      sandbox_code: sandboxCode.text,
      html_wrapper: htmlWrapper,
      preview_ready: true,
      optimization_notes: [
        "Canvas optimized for preview size",
        "Error handling added",
        "Performance monitoring included",
        "Keyboard controls enabled",
        "Real-time value displays added",
      ],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
