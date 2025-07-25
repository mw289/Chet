import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import fs from "fs"
import path from "path"

// Embedded reference code as fallback (keeping a minimal set for reliability)
const EMBEDDED_REFERENCES = {
  pendulum: `<!DOCTYPE html>
<html lang="en">
<head>
<title>Interactive Pendulum Simulation</title>
<style>
    body {
        margin: 0;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
        color: #333;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(121, 98, 166, 0.2);
        border: 1px solid rgba(167, 150, 203, 0.3);
    }
    .header {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        background: linear-gradient(135deg, #7962A6 0%, #A796CB 100%);
        color: white;
        border-radius: 15px;
    }
    .header h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
    }
    canvas {
        border: 3px solid #7962A6;
        border-radius: 15px;
        background: linear-gradient(to bottom, #f0f8ff 0%, #e6f3ff 100%);
        box-shadow: 0 10px 30px rgba(121, 98, 166, 0.3);
    }
    .control-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #7962A6 0%, #A796CB 100%);
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    }
    .control-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(121, 98, 166, 0.4);
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Interactive Pendulum Simulation</h1>
        <p style="font-size: 1.2em; opacity: 0.9;">Energy conservation and harmonic motion analysis</p>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
        <canvas id="canvas" width="800" height="400"></canvas>
    </div>
    
    <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
        <button class="control-btn" id="playPauseBtn">⏸️ Pause</button>
        <button class="control-btn" id="resetBtn">🔄 Reset</button>
    </div>
</div>

<script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let isPlaying = true;
    let length = 1.5;
    let gravity = 9.8;
    let currentAngle = 30 * Math.PI / 180;
    let angularVelocity = 0;
    let mass = 1;
    
    const scale = 150;
    const originX = canvas.width / 2;
    const originY = 80;
    
    function updatePhysics() {
        if (!isPlaying) return;
        
        const angularAcceleration = -(gravity / length) * Math.sin(currentAngle);
        angularVelocity += angularAcceleration * 0.016;
        currentAngle += angularVelocity * 0.016;
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const bobX = originX + length * scale * Math.sin(currentAngle);
        const bobY = originY + length * scale * Math.cos(currentAngle);
        
        ctx.strokeStyle = '#7962A6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();
        
        ctx.fillStyle = '#A796CB';
        ctx.beginPath();
        ctx.arc(originX, originY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#7962A6';
        ctx.beginPath();
        ctx.arc(bobX, bobY, 20, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    function animate() {
        updatePhysics();
        draw();
        requestAnimationFrame(animate);
    }
    
    document.getElementById('playPauseBtn').addEventListener('click', () => {
        isPlaying = !isPlaying;
        document.getElementById('playPauseBtn').textContent = isPlaying ? '⏸️ Pause' : '▶️ Play';
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        currentAngle = 30 * Math.PI / 180;
        angularVelocity = 0;
    });
    
    animate();
</script>
</body>
</html>`,

  projectile: `<!DOCTYPE html>
<html lang="en">
<head>
<title>Projectile Motion Simulator</title>
<style>
    body {
        margin: 0;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
        color: #333;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(121, 98, 166, 0.2);
    }
    .header {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        background: linear-gradient(135deg, #7962A6 0%, #A796CB 100%);
        color: white;
        border-radius: 15px;
    }
    canvas {
        border: 3px solid #7962A6;
        border-radius: 15px;
        background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%);
    }
    .control-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #7962A6 0%, #A796CB 100%);
        color: white;
        font-weight: bold;
        cursor: pointer;
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Projectile Motion Simulator</h1>
        <p>Vector physics and trajectory analysis</p>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
        <canvas id="canvas" width="800" height="400"></canvas>
    </div>
    
    <div style="display: flex; justify-content: center; gap: 10px;">
        <button class="control-btn" id="launchBtn">🚀 Launch</button>
        <button class="control-btn" id="resetBtn">🔄 Reset</button>
    </div>
</div>

<script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let projectile = null;
    let trail = [];
    let angle = 45;
    let velocity = 50;
    let gravity = 9.8;
    
    function launchProjectile() {
        const angleRad = angle * Math.PI / 180;
        projectile = {
            x: 50,
            y: canvas.height - 50,
            vx: velocity * Math.cos(angleRad),
            vy: -velocity * Math.sin(angleRad)
        };
        trail = [];
    }
    
    function updatePhysics() {
        if (!projectile) return;
        
        projectile.vy += gravity * 0.016;
        projectile.x += projectile.vx * 0.016;
        projectile.y += projectile.vy * 0.016;
        
        trail.push({x: projectile.x, y: projectile.y});
        if (trail.length > 100) trail.shift();
        
        if (projectile.y >= canvas.height - 50) {
            projectile = null;
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        
        // Draw trail
        if (trail.length > 1) {
            ctx.strokeStyle = '#7962A6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for (let i = 1; i < trail.length; i++) {
                ctx.lineTo(trail[i].x, trail[i].y);
            }
            ctx.stroke();
        }
        
        // Draw projectile
        if (projectile) {
            ctx.fillStyle = '#A796CB';
            ctx.beginPath();
            ctx.arc(projectile.x, projectile.y, 8, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    function animate() {
        updatePhysics();
        draw();
        requestAnimationFrame(animate);
    }
    
    document.getElementById('launchBtn').addEventListener('click', launchProjectile);
    document.getElementById('resetBtn').addEventListener('click', () => {
        projectile = null;
        trail = [];
    });
    
    animate();
</script>
</body>
</html>`,

  moments: `<!DOCTYPE html>
<html lang="en">
<head>
<title>Moment Physics Simulation</title>
<style>
    body {
        margin: 0;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
        color: #333;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(121, 98, 166, 0.2);
    }
    .header {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        background: linear-gradient(135deg, #7962A6 0%, #A796CB 100%);
        color: white;
        border-radius: 15px;
    }
    canvas {
        border: 3px solid #7962A6;
        border-radius: 15px;
        background: white;
    }
    .control-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #7962A6 0%, #A796CB 100%);
        color: white;
        font-weight: bold;
        cursor: pointer;
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Moment Physics Simulation</h1>
        <p>Torque and rotational equilibrium</p>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
        <canvas id="canvas" width="800" height="400"></canvas>
    </div>
    
    <div style="display: flex; justify-content: center; gap: 10px;">
        <button class="control-btn" id="startBtn">Start</button>
        <button class="control-btn" id="resetBtn">Reset</button>
    </div>
</div>

<script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let beamAngle = 0;
    let isRunning = false;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw pivot
        ctx.fillStyle = '#7962A6';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw beam
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(beamAngle * Math.PI / 180);
        ctx.strokeStyle = '#A796CB';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-200, 0);
        ctx.lineTo(200, 0);
        ctx.stroke();
        ctx.restore();
    }
    
    function animate() {
        if (isRunning) {
            beamAngle += 1;
        }
        draw();
        requestAnimationFrame(animate);
    }
    
    document.getElementById('startBtn').addEventListener('click', () => {
        isRunning = !isRunning;
        document.getElementById('startBtn').textContent = isRunning ? 'Pause' : 'Start';
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        beamAngle = 0;
        isRunning = false;
        document.getElementById('startBtn').textContent = 'Start';
    });
    
    animate();
</script>
</body>
</html>`,

  spring: `<!DOCTYPE html>
<html lang="en">
<head>
<title>Spring Physics Simulation</title>
<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 20px;
        background: #ffffff;
        color: #1f2937;
        line-height: 1.6;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
    h1 {
        text-align: center;
        color: #111827;
        font-weight: 600;
        margin-bottom: 30px;
    }
    canvas {
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        background: #ffffff;
        display: block;
        margin: 0 auto;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .control-btn {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        margin: 6px 8px 6px 0;
        font-weight: 500;
        font-size: 14px;
    }
    .control-btn:hover {
        background: #2563eb;
    }
</style>
</head>
<body>
<div class="container">
    <h1>Spring Physics Simulation</h1>
    
    <div style="text-align: center; margin-bottom: 20px;">
        <button class="control-btn" onclick="resetSimulation()">Reset</button>
        <button class="control-btn" onclick="togglePause()">Pause/Resume</button>
    </div>
    
    <canvas id="simulationCanvas" width="800" height="400"></canvas>
</div>

<script>
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    
    let springConstant = 50;
    let mass = 1.0;
    let position = 50;
    let velocity = 0;
    let isPaused = false;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const massSize = 30;
    
    function resetSimulation() {
        position = 50;
        velocity = 0;
    }
    
    function togglePause() {
        isPaused = !isPaused;
    }
    
    function updatePhysics(dt) {
        if (isPaused) return;
        
        const springForce = -springConstant * position;
        const acceleration = springForce / mass;
        
        velocity += acceleration * dt;
        position += velocity * dt;
    }
    
    function render() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw spring attachment
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(centerX - 15, 30, 30, 15);
        
        // Draw mass
        const massY = centerY + position;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(centerX - massSize/2, massY - massSize/2, massSize, massSize);
        
        // Draw spring line
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, 45);
        ctx.lineTo(centerX, massY - massSize/2);
        ctx.stroke();
    }
    
    function animate() {
        updatePhysics(0.016);
        render();
        requestAnimationFrame(animate);
    }
    
    animate();
</script>
</body>
</html>`,

  collision: `<!DOCTYPE html>
<html lang="en">
<head>
<title>Collision Momentum Physics Simulation</title>
<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 20px;
        background: #ffffff;
        color: #1f2937;
        line-height: 1.6;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
    h1 {
        text-align: center;
        color: #111827;
        font-weight: 600;
        margin-bottom: 30px;
    }
    canvas {
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        background: #ffffff;
        display: block;
        margin: 0 auto;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .control-btn {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        margin: 6px 8px 6px 0;
        font-weight: 500;
        font-size: 14px;
    }
    .control-btn:hover {
        background: #2563eb;
    }
</style>
</head>
<body>
<div class="container">
    <h1>Collision Momentum Physics Simulation</h1>
    
    <div style="text-align: center; margin-bottom: 20px;">
        <button class="control-btn" onclick="resetSimulation()">Reset</button>
        <button class="control-btn" onclick="togglePause()">Pause/Resume</button>
    </div>
    
    <canvas id="simulationCanvas" width="800" height="400"></canvas>
</div>

<script>
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    
    let objects = [];
    let isPaused = false;
    let collisionCount = 0;
    let restitution = 1.0;
    
    function resetSimulation() {
        objects = [];
        collisionCount = 0;
        
        objects.push({x: 150, y: 200, vx: 3, vy: 0, mass: 2, radius: 25, color: '#3b82f6'});
        objects.push({x: 650, y: 200, vx: -1, vy: 0, mass: 1, radius: 20, color: '#ef4444'});
    }
    
    function togglePause() {
        isPaused = !isPaused;
    }
    
    function animate() {
        if (!isPaused) {
            // Simple physics update
            objects.forEach(obj => {
                obj.x += obj.vx;
                obj.y += obj.vy;
            });
        }
        
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        objects.forEach(obj => {
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    resetSimulation();
    animate();
</script>
</body>
</html>`,
}

// Function to select appropriate reference based on user input
function selectReference(userInput: string): string | null {
  const input = userInput.toLowerCase()

  // Pendulum-related keywords
  if (
    input.includes("pendulum") ||
    input.includes("swing") ||
    input.includes("oscillat") ||
    input.includes("harmonic") ||
    input.includes("period") ||
    input.includes("bob")
  ) {
    return "pendulum"
  }

  // Projectile motion keywords
  if (
    input.includes("projectile") ||
    input.includes("trajectory") ||
    input.includes("launch") ||
    input.includes("cannon") ||
    input.includes("ballistic") ||
    input.includes("parabola") ||
    input.includes("throw") ||
    input.includes("shoot")
  ) {
    return "projectile"
  }

  // Spring/oscillation keywords
  if (
    input.includes("spring") ||
    input.includes("oscillat") ||
    input.includes("hooke") ||
    input.includes("elastic") ||
    input.includes("vibrat") ||
    (input.includes("mass") && input.includes("spring")) ||
    input.includes("simple harmonic") ||
    input.includes("shm")
  ) {
    return "spring"
  }

  // Collision/momentum keywords
  if (
    input.includes("collision") ||
    input.includes("momentum") ||
    input.includes("impact") ||
    input.includes("crash") ||
    input.includes("elastic collision") ||
    input.includes("inelastic") ||
    input.includes("conservation of momentum") ||
    input.includes("restitution") ||
    input.includes("billiard") ||
    (input.includes("ball") && input.includes("hit"))
  ) {
    return "collision"
  }

  // Moments/torque keywords
  if (
    input.includes("moment") ||
    input.includes("torque") ||
    input.includes("lever") ||
    input.includes("balance") ||
    input.includes("pivot") ||
    input.includes("beam") ||
    input.includes("seesaw") ||
    input.includes("rotation") ||
    input.includes("angular")
  ) {
    return "moments"
  }

  // Light/optics keywords
  if (
    input.includes("light") ||
    input.includes("optic") ||
    input.includes("reflect") ||
    input.includes("refract") ||
    input.includes("mirror") ||
    input.includes("lens")
  ) {
    return "light-reflection"
  }

  // Wave keywords
  if (
    input.includes("wave") ||
    input.includes("interferen") ||
    input.includes("diffraction") ||
    input.includes("frequency") ||
    input.includes("amplitude") ||
    input.includes("slit")
  ) {
    if (input.includes("double") && input.includes("slit")) {
      return "double-slit"
    }
    return "wave-interference"
  }

  // Default to pendulum for general physics requests
  return "pendulum"
}

// Function to read reference HTML file with fallback to embedded content
async function readReferenceFile(refName: string): Promise<string> {
  try {
    // First try to read from file system
    const possiblePaths = [
      path.join(process.cwd(), "references", `${refName}.html`),
      path.join(process.cwd(), "public", "references", `${refName}.html`),
      path.join(process.cwd(), "app", "references", `${refName}.html`),
    ]

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath)
          if (stats.isFile()) {
            const content = fs.readFileSync(filePath, "utf8")
            console.log(`Successfully loaded reference from: ${filePath}`)
            return content
          }
        }
      } catch (pathError) {
        console.warn(`Failed to read from path ${filePath}:`, pathError)
        continue
      }
    }

    // Fallback to embedded references
    console.log(`Using embedded reference for: ${refName}`)
    return EMBEDDED_REFERENCES[refName as keyof typeof EMBEDDED_REFERENCES] || ""
  } catch (error) {
    console.error(`Error reading reference file ${refName}.html:`, error)
    // Return embedded reference as final fallback
    return EMBEDDED_REFERENCES[refName as keyof typeof EMBEDDED_REFERENCES] || ""
  }
}

function extractPhysicsConcepts(input: string): string[] {
  const concepts: string[] = []
  const lowerInput = input.toLowerCase()

  // Physics concept mapping
  const conceptMap: Record<string, string[]> = {
    energy: ["Energy Conservation", "Kinetic Energy", "Potential Energy"],
    force: ["Force", "Newton's Laws", "Acceleration"],
    motion: ["Kinematics", "Velocity", "Acceleration"],
    wave: ["Wave Interference", "Diffraction", "Superposition"],
    light: ["Reflection", "Refraction", "Optics"],
    pendulum: ["Simple Harmonic Motion", "Period", "Oscillation"],
    projectile: ["Projectile Motion", "Trajectory", "Range"],
    moment: ["Torque", "Rotational Dynamics", "Equilibrium"],
    collision: ["Momentum Conservation", "Elastic Collision", "Coefficient of Restitution"],
    spring: ["Hooke's Law", "Simple Harmonic Motion", "Elastic Force"],
  }

  // Extract concepts based on keywords in input
  for (const [keyword, relatedConcepts] of Object.entries(conceptMap)) {
    if (lowerInput.includes(keyword)) {
      // Add up to 3 related concepts
      relatedConcepts.slice(0, 3).forEach((concept) => {
        if (!concepts.includes(concept)) {
          concepts.push(concept)
        }
      })
    }
  }

  // If no concepts were found, add some general physics concepts
  if (concepts.length === 0) {
    concepts.push("Physics Simulation", "Interactive Learning", "Scientific Visualization")
  }

  return concepts
}

export async function POST(req: NextRequest) {
  try {
    const { user_input, language = "en" } = await req.json()

    if (!user_input) {
      return NextResponse.json({ error: "Missing user_input" }, { status: 400 })
    }

    // Select appropriate reference code
    const referenceType = selectReference(user_input)
    const referenceCode = await readReferenceFile(referenceType || "pendulum")

    const referenceNote = referenceCode
      ? "Using reference code patterns for structure and styling."
      : "No specific reference found, using general physics simulation approach."

    const result = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.3,
      prompt: `You are an expert physics simulation developer. Create a complete, interactive HTML physics simulation based on the user's request.

User Request: ${user_input}
Language: ${language}
Reference Note: ${referenceNote}

${
  referenceCode
    ? `REFERENCE CODE (for learning patterns only - create something unique):
${referenceCode}

IMPORTANT: This reference code is provided to help you understand:
- Professional HTML structure and styling patterns
- Physics calculation approaches
- Interactive control implementations
- Visual design and layout principles
- Real-time physics display methods

You MUST create a completely original simulation that is inspired by but NOT a copy of this reference.`
    : ""
}

CRITICAL ENCODING REQUIREMENTS:
1. NEVER use Unicode emojis (🎮, 📊, 🔧, etc.) - they cause encoding issues
2. Instead use HTML-safe alternatives:
   - For controls: "Controls" or "⚙" (HTML entity)
   - For physics: "Physics" or "📈" → "Data" 
   - For equations: "Equations" or "∑" (HTML entity)
   - For settings: "Settings" or "⚙" (HTML entity)
   - For play/pause: "▶" and "⏸" (HTML entities)
   - For reset: "↻" (HTML entity)
   - For info: "ℹ" (HTML entity)
3. Always include proper UTF-8 meta charset declaration
4. Use HTML entities for special characters: &hearts; &spades; &clubs; &diams;
5. For mathematical symbols use: &alpha; &beta; &gamma; &theta; &pi; &sum; &int;

Requirements:
1. Create a complete, standalone HTML file with embedded CSS and JavaScript
2. Include accurate physics calculations and real-time updates
3. Add interactive controls (sliders, buttons) for key parameters
4. Display real-time physics values and calculations
5. Use professional styling with gradients and modern UI
6. Include educational information about the physics concepts
7. Add pause/play controls and reset functionality
8. Ensure the simulation is responsive and works in browsers
9. Use the signature purple gradient color scheme (#7962A6 to #A796CB)
10. Include proper physics equations and explanations
11. MUST start with proper DOCTYPE and UTF-8 encoding:
    <!DOCTYPE html>
    <html lang="${language === "id" ? "id" : "en"}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

${
  language === "id"
    ? `
LANGUAGE REQUIREMENTS:
- All text, labels, and descriptions must be in Bahasa Indonesia
- Physics terms should use Indonesian scientific terminology
- Keep physics equations in standard mathematical notation
- Ensure all UI elements are properly translated
- Use HTML entities instead of Unicode emojis
`
    : ""
}

SAFE CHARACTER ALTERNATIVES:
- Instead of 🎮: "Controls" or "⚙"
- Instead of 📊: "Data" or "📈" → "Chart"
- Instead of 🔧: "Settings" or "⚙"
- Instead of ⏸️: "⏸" (HTML entity)
- Instead of ▶️: "▶" (HTML entity)
- Instead of 🔄: "↻" (HTML entity)
- Instead of 📐: "Math" or "∠"
- Instead of 🧠: "Physics" or "Φ"

Physics Accuracy Requirements:
- Use correct physics formulas and constants
- Implement proper numerical integration for motion
- Include realistic parameter ranges
- Add energy conservation where applicable
- Show vector components and forces visually

Visual Requirements:
- Professional gradient backgrounds
- Clear, readable fonts and layouts
- Smooth animations and transitions
- Color-coded physics concepts
- Interactive visual feedback

Output only the complete HTML code - no explanations or markdown formatting.`,
    })

    // Extract structured data for display
    const structuredData = {
      topic: user_input.split(" ").slice(0, 3).join(" ") + " Simulation",
      key_concepts: extractPhysicsConcepts(user_input),
      user_level: "intermediate",
      language: language,
    }

    const features = [
      "✅ Real-time physics calculations",
      "✅ Interactive parameter controls",
      "✅ Pause/play functionality",
      "✅ Professional gradient styling",
      "✅ Educational physics information",
      "✅ Responsive design",
    ]

    return NextResponse.json({
      success: true,
      simulation_html: result.text,
      structured_data: structuredData,
      features: features,
      pipeline_steps: [
        "✅ Physics concepts analyzed",
        "✅ Reference patterns applied",
        "✅ Interactive controls generated",
        "✅ Real-time calculations implemented",
        "✅ Professional styling applied",
        "✅ Educational content added",
      ],
      language: language,
    })
  } catch (error: any) {
    console.error("Orchestrator error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to generate simulation",
      },
      { status: 500 },
    )
  }
}
