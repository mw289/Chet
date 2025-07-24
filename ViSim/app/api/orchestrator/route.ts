import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Actual HTML code references for AI to learn from and create variations
const HTML_CODE_REFERENCES = {
  "double-slit": `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Double-Slit Experiment</title>
  <style>
      body {
          margin: 0;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
      }
      .container {
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }
      .header {
          text-align: center;
          margin-bottom: 30px;
      }
      .header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
      }
      .simulation-area {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
      }
      canvas {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          background: #000;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .controls-panel {
          min-width: 350px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
          backdrop-filter: blur(5px);
      }
      .control-group {
          margin-bottom: 25px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .control-group h3 {
          margin: 0 0 15px 0;
          color: #FFD700;
          font-size: 1.2em;
          border-bottom: 2px solid #FFD700;
          padding-bottom: 8px;
      }
      .slider-container {
          margin-bottom: 15px;
      }
      .slider-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #E0E0E0;
      }
      .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
      }
      .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
      .value-display {
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 12px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          text-align: center;
          margin-top: 8px;
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.3);
      }
      .physics-info {
          background: rgba(0, 0, 0, 0.2);
          padding: 20px;
          border-radius: 15px;
          margin-top: 20px;
          border-left: 4px solid #FFD700;
      }
      .physics-info h4 {
          color: #FFD700;
          margin-bottom: 10px;
      }
      .equation {
          background: rgba(255, 255, 255, 0.1);
          padding: 10px;
          border-radius: 8px;
          font-family: 'Times New Roman', serif;
          text-align: center;
          margin: 10px 0;
          font-size: 1.1em;
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <h1>Double-Slit Experiment</h1>
          <p style="font-size: 1.2em; opacity: 0.9;">Light wave diffraction and interference demonstration</p>
      </div>
      
      <div class="simulation-area">
          <canvas id="canvas" width="900" height="600"></canvas>
          
          <div class="controls-panel">
              <div class="control-group">
                  <h3>🔬 Experiment Parameters</h3>
                  
                  <div class="slider-container">
                      <label class="slider-label">Wavelength (nm)</label>
                      <input type="range" class="slider" id="wavelength" min="400" max="700" value="550" step="10">
                      <div class="value-display" id="wavelengthValue">550 nm</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Slit Separation (μm)</label>
                      <input type="range" class="slider" id="slitSep" min="1" max="20" value="8" step="0.5">
                      <div class="value-display" id="slitSepValue">8.0 μm</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Slit Width (μm)</label>
                      <input type="range" class="slider" id="slitWidth" min="0.5" max="8" value="2" step="0.1">
                      <div class="value-display" id="slitWidthValue">2.0 μm</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Screen Distance (m)</label>
                      <input type="range" class="slider" id="screenDist" min="0.5" max="3" value="1.5" step="0.1">
                      <div class="value-display" id="screenDistValue">1.5 m</div>
                  </div>
              </div>
              
              <div class="physics-info">
                  <h4>📊 Interference Pattern Analysis</h4>
                  <div id="physicsData"></div>
                  
                  <div class="equation">
                      <strong>Bright Fringes:</strong><br>
                      y = m × λL/d
                  </div>
                  <div class="equation">
                      <strong>Dark Fringes:</strong><br>
                      y = (m + ½) × λL/d
                  </div>
              </div>
          </div>
      </div>
  </div>

  <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      
      let wavelength = 550e-9;
      let slitSeparation = 8e-6;
      let slitWidth = 2e-6;
      let screenDistance = 1.5;
      
      function updateValues() {
          wavelength = document.getElementById('wavelength').value * 1e-9;
          slitSeparation = document.getElementById('slitSep').value * 1e-6;
          slitWidth = document.getElementById('slitWidth').value * 1e-6;
          screenDistance = document.getElementById('screenDist').value;
          
          document.getElementById('wavelengthValue').textContent = (wavelength * 1e9).toFixed(0) + ' nm';
          document.getElementById('slitSepValue').textContent = (slitSeparation * 1e6).toFixed(1) + ' μm';
          document.getElementById('slitWidthValue').textContent = (slitWidth * 1e6).toFixed(1) + ' μm';
          document.getElementById('screenDistValue').textContent = screenDistance.toFixed(1) + ' m';
      }
      
      function getWavelengthColor(wavelength) {
          const wl = wavelength * 1e9;
          let r, g, b;
          
          if (wl >= 380 && wl < 440) {
              r = -(wl - 440) / (440 - 380);
              g = 0.0;
              b = 1.0;
          } else if (wl >= 440 && wl < 490) {
              r = 0.0;
              g = (wl - 440) / (490 - 440);
              b = 1.0;
          } else if (wl >= 490 && wl < 510) {
              r = 0.0;
              g = 1.0;
              b = -(wl - 510) / (510 - 490);
          } else if (wl >= 510 && wl < 580) {
              r = (wl - 510) / (580 - 510);
              g = 1.0;
              b = 0.0;
          } else if (wl >= 580 && wl < 645) {
              r = 1.0;
              g = -(wl - 645) / (645 - 580);
              b = 0.0;
          } else if (wl >= 645 && wl < 781) {
              r = 1.0;
              g = 0.0;
              b = 0.0;
          } else {
              r = 0.0;
              g = 0.0;
              b = 0.0;
          }
          
          return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }
      
      function drawSimulation() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const slitX = 150;
          const screenX = canvas.width - 100;
          const centerY = canvas.height / 2;
          
          const [r, g, b] = getWavelengthColor(wavelength);
          ctx.fillStyle = \`rgb(\${r}, \${g}, \${b})\`;
          ctx.beginPath();
          ctx.arc(50, centerY, 15, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = '#333';
          ctx.fillRect(slitX - 10, 0, 20, canvas.height);
          
          const slitHeight = Math.max(20, slitWidth * 1e6 * 3);
          const slit1Y = centerY - slitSeparation * 1e6 * 15;
          const slit2Y = centerY + slitSeparation * 1e6 * 15;
          
          ctx.fillStyle = '#000';
          ctx.fillRect(slitX - 10, slit1Y - slitHeight/2, 20, slitHeight);
          ctx.fillRect(slitX - 10, slit2Y - slitHeight/2, 20, slitHeight);
          
          ctx.fillStyle = '#ddd';
          ctx.fillRect(screenX, 0, 20, canvas.height);
          
          const patternData = [];
          for (let y = 0; y < canvas.height; y++) {
              const screenY = (y - centerY) * screenDistance / 300;
              
              const r1 = Math.sqrt(Math.pow(screenDistance, 2) + Math.pow(screenY + slitSeparation/2, 2));
              const r2 = Math.sqrt(Math.pow(screenDistance, 2) + Math.pow(screenY - slitSeparation/2, 2));
              const pathDiff = r2 - r1;
              
              const phaseDiff = 2 * Math.PI * pathDiff / wavelength;
              const interference = Math.pow(Math.cos(phaseDiff / 2), 2);
              
              const beta = Math.PI * slitWidth * screenY / (wavelength * screenDistance);
              const diffraction = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
              
              const intensity = interference * diffraction;
              patternData.push(intensity);
              
              const brightness = Math.floor(255 * intensity);
              ctx.fillStyle = \`rgb(\${Math.floor(r * intensity)}, \${Math.floor(g * intensity)}, \${Math.floor(b * intensity)})\`;
              ctx.fillRect(screenX, y, 20, 1);
          }
          
          ctx.strokeStyle = \`rgba(\${r}, \${g}, \${b}, 0.3)\`;
          ctx.lineWidth = 2;
          for (let i = 0; i < 15; i++) {
              const angle = (i - 7) * 0.1;
              ctx.beginPath();
              ctx.moveTo(65, centerY);
              ctx.lineTo(slitX - 10, slit1Y);
              ctx.lineTo(screenX, centerY + angle * 100);
              ctx.stroke();
              
              ctx.beginPath();
              ctx.moveTo(65, centerY);
              ctx.lineTo(slitX - 10, slit2Y);
              ctx.lineTo(screenX, centerY + angle * 100);
              ctx.stroke();
          }
          
          const fringeSpacing = wavelength * screenDistance / slitSeparation;
          document.getElementById('physicsData').innerHTML = \`
              <div style="margin-bottom: 10px;"><strong>Wavelength:</strong> \${(wavelength * 1e9).toFixed(0)} nm</div>
              <div style="margin-bottom: 10px;"><strong>Fringe Spacing:</strong> \${(fringeSpacing * 1000).toFixed(2)} mm</div>
              <div style="margin-bottom: 10px;"><strong>Angular Width:</strong> \${(wavelength / slitSeparation * 1000).toFixed(2)} mrad</div>
              <div><strong>Coherence:</strong> \${wavelength < 600e-9 ? 'High' : 'Medium'}</div>
          \`;
      }
      
      ['wavelength', 'slitSep', 'slitWidth', 'screenDist'].forEach(id => {
          document.getElementById(id).addEventListener('input', () => {
              updateValues();
              drawSimulation();
          });
      });
      
      updateValues();
      drawSimulation();
      
      function animate() {
          drawSimulation();
          requestAnimationFrame(animate);
      }
      animate();
  </script>
</body>
</html>`,

  "light-reflection": `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Light Reflection Simulation</title>
  <style>
      body {
          margin: 0;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
      }
      .container {
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }
      .header {
          text-align: center;
          margin-bottom: 30px;
      }
      .header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #FFD700, #FF6B6B);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
      }
      .simulation-area {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
      }
      canvas {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          background: linear-gradient(to bottom, #87CEEB 0%, #87CEEB 60%, #C0C0C0 60%, #C0C0C0 100%);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .controls-panel {
          min-width: 350px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
          backdrop-filter: blur(5px);
      }
      .control-group {
          margin-bottom: 25px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .control-group h3 {
          margin: 0 0 15px 0;
          color: #FFD700;
          font-size: 1.2em;
          border-bottom: 2px solid #FFD700;
          padding-bottom: 8px;
      }
      .slider-container {
          margin-bottom: 15px;
      }
      .slider-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #E0E0E0;
      }
      .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
      }
      .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #FFD700, #FF6B6B);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
      .value-display {
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 12px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          text-align: center;
          margin-top: 8px;
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.3);
      }
      .physics-info {
          background: rgba(0, 0, 0, 0.2);
          padding: 20px;
          border-radius: 15px;
          margin-top: 20px;
          border-left: 4px solid #FF6B6B;
      }
      .angle-display {
          background: rgba(255, 107, 107, 0.2);
          padding: 15px;
          border-radius: 10px;
          margin: 10px 0;
          text-align: center;
          font-size: 1.2em;
          font-weight: bold;
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <h1>Light Reflection Simulation</h1>
          <p style="font-size: 1.2em; opacity: 0.9;">Law of reflection and angle analysis</p>
      </div>
      
      <div class="simulation-area">
          <canvas id="canvas" width="900" height="600"></canvas>
          
          <div class="controls-panel">
              <div class="control-group">
                  <h3>🔧 Reflection Controls</h3>
                  
                  <div class="slider-container">
                      <label class="slider-label">Incident Angle (°)</label>
                      <input type="range" class="slider" id="angle" min="10" max="80" value="45" step="1">
                      <div class="value-display" id="angleValue">45°</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Source Position</label>
                      <input type="range" class="slider" id="sourceX" min="100" max="400" value="200" step="10">
                      <div class="value-display" id="sourceXValue">200</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Mirror Angle (°)</label>
                      <input type="range" class="slider" id="mirrorAngle" min="-30" max="30" value="0" step="1">
                      <div class="value-display" id="mirrorAngleValue">0°</div>
                  </div>
              </div>
              
              <div class="physics-info">
                  <h4>📐 Law of Reflection: θᵢ = θᵣ</h4>
                  <div class="angle-display" id="angleDisplay"></div>
                  <div id="physicsData"></div>
              </div>
          </div>
      </div>
  </div>

  <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      
      let incidentAngle = 45;
      let sourceX = 200;
      let mirrorAngle = 0;
      const mirrorY = canvas.height * 0.7;
      
      function updateValues() {
          incidentAngle = parseFloat(document.getElementById('angle').value);
          sourceX = parseFloat(document.getElementById('sourceX').value);
          mirrorAngle = parseFloat(document.getElementById('mirrorAngle').value);
          
          document.getElementById('angleValue').textContent = incidentAngle + '°';
          document.getElementById('sourceXValue').textContent = sourceX;
          document.getElementById('mirrorAngleValue').textContent = mirrorAngle + '°';
      }
      
      function drawSimulation() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const skyGradient = ctx.createLinearGradient(0, 0, 0, mirrorY);
          skyGradient.addColorStop(0, '#87CEEB');
          skyGradient.addColorStop(1, '#B0E0E6');
          ctx.fillStyle = skyGradient;
          ctx.fillRect(0, 0, canvas.width, mirrorY);
          
          const groundGradient = ctx.createLinearGradient(0, mirrorY, 0, canvas.height);
          groundGradient.addColorStop(0, '#C0C0C0');
          groundGradient.addColorStop(1, '#A0A0A0');
          ctx.fillStyle = groundGradient;
          ctx.fillRect(0, mirrorY, canvas.width, canvas.height - mirrorY);
          
          ctx.save();
          ctx.translate(canvas.width / 2, mirrorY);
          ctx.rotate(mirrorAngle * Math.PI / 180);
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-canvas.width / 2, 0);
          ctx.lineTo(canvas.width / 2, 0);
          ctx.stroke();
          ctx.restore();
          
          const sourceY = 150;
          
          const mirrorSlope = Math.tan(mirrorAngle * Math.PI / 180);
          const raySlope = Math.tan(incidentAngle * Math.PI / 180);
          
          const intersectionX = (mirrorY - sourceY + raySlope * sourceX) / (raySlope - mirrorSlope) + canvas.width / 2;
          const intersectionY = mirrorY + mirrorSlope * (intersectionX - canvas.width / 2);
          
          const clampedX = Math.max(50, Math.min(canvas.width - 50, intersectionX));
          const clampedY = Math.max(mirrorY - 50, Math.min(canvas.height - 50, intersectionY));
          
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(sourceX, sourceY, 12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#FFA500';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          ctx.strokeStyle = '#FF4444';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(sourceX, sourceY);
          ctx.lineTo(clampedX, clampedY);
          ctx.stroke();
          
          const normalAngle = mirrorAngle + 90;
          const incidentVector = [clampedX - sourceX, clampedY - sourceY];
          const normalVector = [Math.cos(normalAngle * Math.PI / 180), Math.sin(normalAngle * Math.PI / 180)];
          
          const dotProduct = incidentVector[0] * normalVector[0] + incidentVector[1] * normalVector[1];
          const reflectedVector = [
              incidentVector[0] - 2 * dotProduct * normalVector[0],
              incidentVector[1] - 2 * dotProduct * normalVector[1]
          ];
          
          const reflectedEndX = clampedX + reflectedVector[0];
          const reflectedEndY = clampedY + reflectedVector[1];
          
          ctx.strokeStyle = '#4444FF';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(clampedX, clampedY);
          ctx.lineTo(reflectedEndX, reflectedEndY);
          ctx.stroke();
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 10]);
          ctx.beginPath();
          const normalLength = 100;
          ctx.moveTo(clampedX - normalVector[0] * normalLength, clampedY - normalVector[1] * normalLength);
          ctx.lineTo(clampedX + normalVector[0] * normalLength, clampedY + normalVector[1] * normalLength);
          ctx.stroke();
          ctx.setLineDash([]);
          
          const actualIncidentAngle = Math.abs(Math.atan2(clampedY - sourceY, clampedX - sourceX) * 180 / Math.PI - (90 + mirrorAngle));
          const reflectedAngle = actualIncidentAngle;
          
          document.getElementById('angleDisplay').innerHTML = \`
              θᵢ = \${actualIncidentAngle.toFixed(1)}° | θᵣ = \${reflectedAngle.toFixed(1)}°
          \`;
          
          document.getElementById('physicsData').innerHTML = \`
              <div style="margin-bottom: 10px;"><strong>Incident Ray:</strong> \${actualIncidentAngle.toFixed(1)}°</div>
              <div style="margin-bottom: 10px;"><strong>Reflected Ray:</strong> \${reflectedAngle.toFixed(1)}°</div>
              <div style="margin-bottom: 10px;"><strong>Mirror Tilt:</strong> \${mirrorAngle}°</div>
              <div><strong>Verification:</strong> \${Math.abs(actualIncidentAngle - reflectedAngle) < 0.1 ? '✅ Law Verified' : '❌ Check Setup'}</div>
          \`;
          
          ctx.fillStyle = '#FFD700';
          ctx.font = 'bold 16px Arial';
          ctx.fillText(\`θᵢ = \${actualIncidentAngle.toFixed(1)}°\`, clampedX - 100, clampedY - 30);
          ctx.fillText(\`θᵣ = \${reflectedAngle.toFixed(1)}°\`, clampedX + 20, clampedY - 30);
      }
      
      ['angle', 'sourceX', 'mirrorAngle'].forEach(id => {
          document.getElementById(id).addEventListener('input', () => {
              updateValues();
              drawSimulation();
          });
      });
      
      updateValues();
      drawSimulation();
  </script>
</body>
</html>`,

  "wave-interference": `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Wave Interference Simulation</title>
  <style>
      body {
          margin: 0;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 100%);
          color: white;
      }
      .container {
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      }
      .header {
          text-align: center;
          margin-bottom: 30px;
      }
      .header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #00FFFF, #FF00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
      }
      .simulation-area {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
      }
      canvas {
          border: 3px solid rgba(0, 255, 255, 0.3);
          border-radius: 15px;
          background: #000011;
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
      }
      .controls-panel {
          min-width: 350px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 25px;
          backdrop-filter: blur(5px);
      }
      .control-group {
          margin-bottom: 25px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(0, 255, 255, 0.2);
      }
      .control-group h3 {
          margin: 0 0 15px 0;
          color: #00FFFF;
          font-size: 1.2em;
          border-bottom: 2px solid #00FFFF;
          padding-bottom: 8px;
      }
      .slider-container {
          margin-bottom: 15px;
      }
      .slider-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #E0E0FF;
      }
      .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
      }
      .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00FFFF, #FF00FF);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
      .value-display {
          background: rgba(0, 0, 0, 0.5);
          padding: 8px 12px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          text-align: center;
          margin-top: 8px;
          color: #00FFFF;
          border: 1px solid rgba(0, 255, 255, 0.3);
      }
      .physics-info {
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 15px;
          margin-top: 20px;
          border-left: 4px solid #FF00FF;
      }
      .wave-equation {
          background: rgba(255, 0, 255, 0.1);
          padding: 15px;
          border-radius: 10px;
          margin: 10px 0;
          text-align: center;
          font-family: 'Times New Roman', serif;
          font-size: 1.1em;
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <h1>Wave Interference Simulation</h1>
          <p style="font-size: 1.2em; opacity: 0.9;">Constructive and destructive interference from two sources</p>
      </div>
      
      <div class="simulation-area">
          <canvas id="canvas" width="900" height="600"></canvas>
          
          <div class="controls-panel">
              <div class="control-group">
                  <h3>🌊 Wave Parameters</h3>
                  
                  <div class="slider-container">
                      <label class="slider-label">Source 1 Frequency (Hz)</label>
                      <input type="range" class="slider" id="freq1" min="0.5" max="5" value="2" step="0.1">
                      <div class="value-display" id="freq1Value">2.0 Hz</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Source 2 Frequency (Hz)</label>
                      <input type="range" class="slider" id="freq2" min="0.5" max="5" value="2.3" step="0.1">
                      <div class="value-display" id="freq2Value">2.3 Hz</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Source 1 Amplitude</label>
                      <input type="range" class="slider" id="amp1" min="0.1" max="2" value="1" step="0.1">
                      <div class="value-display" id="amp1Value">1.0</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Source 2 Amplitude</label>
                      <input type="range" class="slider" id="amp2" min="0.1" max="2" value="1" step="0.1">
                      <div class="value-display" id="amp2Value">1.0</div>
                  </div>
                  
                  <div class="slider-container">
                      <label class="slider-label">Source Distance (px)</label>
                      <input type="range" class="slider" id="distance" min="50" max="300" value="150" step="10">
                      <div class="value-display" id="distanceValue">150 px</div>
                  </div>
              </div>
              
              <div class="physics-info">
                  <h4>📊 Interference Analysis</h4>
                  <div id="physicsData"></div>
                  
                  <div class="wave-equation">
                      <strong>Wave Equation:</strong><br>
                      y = A₁sin(2πf₁t - kr₁) + A₂sin(2πf₂t - kr₂)
                  </div>
                  
                  <div class="wave-equation">
                      <strong>Beat Frequency:</strong><br>
                      f_beat = |f₁ - f₂|
                  </div>
              </div>
          </div>
      </div>
  </div>

  <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      
      let freq1 = 2.0;
      let freq2 = 2.3;
      let amp1 = 1.0;
      let amp2 = 1.0;
      let sourceDistance = 150;
      let time = 0;
      let waveSpeed = 100;
      
      function updateValues() {
          freq1 = parseFloat(document.getElementById('freq1').value);
          freq2 = parseFloat(document.getElementById('freq2').value);
          amp1 = parseFloat(document.getElementById('amp1').value);
          amp2 = parseFloat(document.getElementById('amp2').value);
          sourceDistance = parseFloat(document.getElementById('distance').value);
          
          document.getElementById('freq1Value').textContent = freq1.toFixed(1) + ' Hz';
          document.getElementById('freq2Value').textContent = freq2.toFixed(1) + ' Hz';
          document.getElementById('amp1Value').textContent = amp1.toFixed(1);
          document.getElementById('amp2Value').textContent = amp2.toFixed(1);
          document.getElementById('distanceValue').textContent = sourceDistance + ' px';
      }
      
      function drawWaves() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const centerY = canvas.height / 2;
          const source1X = canvas.width / 2 - sourceDistance / 2;
          const source2X = canvas.width / 2 + sourceDistance / 2;
          
          const wavelength1 = waveSpeed / freq1;
          const wavelength2 = waveSpeed / freq2;
          
          const imageData = ctx.createImageData(canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let x = 0; x < canvas.width; x++) {
              for (let y = 0; y < canvas.height; y++) {
                  const r1 = Math.sqrt((x - source1X) ** 2 + (y - centerY) ** 2);
                  const r2 = Math.sqrt((x - source2X) ** 2 + (y - centerY) ** 2);
                  
                  const k1 = 2 * Math.PI / wavelength1;
                  const k2 = 2 * Math.PI / wavelength2;
                  
                  const wave1 = amp1 * Math.sin(2 * Math.PI * freq1 * time - k1 * r1);
                  const wave2 = amp2 * Math.sin(2 * Math.PI * freq2 * time - k2 * r2);
                  
                  const totalAmplitude = wave1 + wave2;
                  const intensity = Math.abs(totalAmplitude) / (amp1 + amp2);
                  
                  const pixelIndex = (y * canvas.width + x) * 4;
                  
                  if (totalAmplitude > 0) {
                      data[pixelIndex] = Math.floor(intensity * 100);
                      data[pixelIndex + 1] = Math.floor(intensity * 255);
                      data[pixelIndex + 2] = Math.floor(intensity * 255);
                  } else {
                      data[pixelIndex] = Math.floor(intensity * 255);
                      data[pixelIndex + 1] = Math.floor(intensity * 100);
                      data[pixelIndex + 2] = Math.floor(intensity * 255);
                  }
                  data[pixelIndex + 3] = Math.floor(255 * intensity);
              }
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          const pulse1 = 0.8 + 0.2 * Math.sin(2 * Math.PI * freq1 * time);
          const pulse2 = 0.8 + 0.2 * Math.sin(2 * Math.PI * freq2 * time);
          
          ctx.fillStyle = \`rgba(0, 255, 255, \${pulse1})\`;
          ctx.beginPath();
          ctx.arc(source1X, centerY, 15 * pulse1, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#00FFFF';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          ctx.fillStyle = \`rgba(255, 0, 255, \${pulse2})\`;
          ctx.beginPath();
          ctx.arc(source2X, centerY, 15 * pulse2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#FF00FF';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          ctx.fillStyle = '#00FFFF';
          ctx.font = 'bold 14px Arial';
          ctx.fillText('S₁', source1X - 10, centerY - 25);
          ctx.fillStyle = '#FF00FF';
          ctx.fillText('S₂', source2X - 10, centerY - 25);
          
          const beatFreq = Math.abs(freq1 - freq2);
          const avgFreq = (freq1 + freq2) / 2;
          const maxAmplitude = amp1 + amp2;
          const minAmplitude = Math.abs(amp1 - amp2);
          
          document.getElementById('physicsData').innerHTML = \`
              <div style="margin-bottom: 10px;"><strong>Beat Frequency:</strong> \${beatFreq.toFixed(2)} Hz</div>
              <div style="margin-bottom: 10px;"><strong>Average Frequency:</strong> \${avgFreq.toFixed(2)} Hz</div>
              <div style="margin-bottom: 10px;"><strong>Max Amplitude:</strong> \${maxAmplitude.toFixed(2)}</div>
              <div style="margin-bottom: 10px;"><strong>Min Amplitude:</strong> \${minAmplitude.toFixed(2)}</div>
              <div style="margin-bottom: 10px;"><strong>λ₁:</strong> \${wavelength1.toFixed(1)} px</div>
              <div><strong>λ₂:</strong> \${wavelength2.toFixed(1)} px</div>
          \`;
      }
      
      function animate() {
          time += 0.016;
          drawWaves();
          requestAnimationFrame(animate);
      }
      
      ['freq1', 'freq2', 'amp1', 'amp2', 'distance'].forEach(id => {
          document.getElementById(id).addEventListener('input', updateValues);
      });
      
      updateValues();
      animate();
  </script>
</body>
</html>`,

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
      .canvas-container {
          text-align: center;
          margin-bottom: 30px;
      }
      canvas {
          border: 3px solid #7962A6;
          border-radius: 15px;
          background: linear-gradient(to bottom, #f0f8ff 0%, #e6f3ff 100%);
          box-shadow: 0 10px 30px rgba(121, 98, 166, 0.3);
      }
      .controls-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
      }
      .control-group {
          background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
          border-radius: 15px;
          padding: 25px;
          border: 1px solid rgba(167, 150, 203, 0.3);
      }
      .control-group h3 {
          margin: 0 0 20px 0;
          color: #7962A6;
          font-size: 1.3em;
          border-bottom: 2px solid #A796CB;
          padding-bottom: 10px;
      }
      .play-pause-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
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
      .slider-container {
          margin-bottom: 15px;
      }
      .slider-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #7962A6;
      }
      .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(167, 150, 203, 0.2);
          outline: none;
          -webkit-appearance: none;
          accent-color: #7962A6;
      }
      .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #7962A6, #A796CB);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(121, 98, 166, 0.3);
      }
      .value-display {
          background: linear-gradient(135deg, #A796CB20 0%, #7962A620 100%);
          padding: 8px 12px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          text-align: center;
          margin-top: 8px;
          color: #7962A6;
          border: 1px solid rgba(167, 150, 203, 0.3);
      }
      .physics-values {
          background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 30px;
          border: 1px solid rgba(167, 150, 203, 0.3);
      }
      .physics-values h3 {
          color: #7962A6;
          margin-bottom: 20px;
          font-size: 1.3em;
          text-align: center;
          border-bottom: 2px solid #A796CB;
          padding-bottom: 10px;
      }
      .physics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
      }
      .physics-item {
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 10px;
          border: 1px solid rgba(167, 150, 203, 0.2);
      }
      .physics-label {
          font-weight: 600;
          color: #7962A6;
          font-size: 0.9em;
          margin-bottom: 5px;
      }
      .physics-value {
          font-family: 'Courier New', monospace;
          color: #333;
          font-weight: bold;
          font-size: 1.1em;
      }
      .concepts-equations {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
      }
      .concepts-section, .equations-section {
          background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
          padding: 25px;
          border-radius: 15px;
          border: 1px solid rgba(167, 150, 203, 0.3);
      }
      .concepts-section h3, .equations-section h3 {
          color: #7962A6;
          margin-bottom: 20px;
          font-size: 1.3em;
          border-bottom: 2px solid #A796CB;
          padding-bottom: 10px;
      }
      .concept-item {
          background: rgba(255, 255, 255, 0.8);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 10px;
          border: 1px solid rgba(167, 150, 203, 0.2);
      }
      .equation {
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
          text-align: center;
          font-family: 'Times New Roman', serif;
          font-size: 1.1em;
          border: 1px solid rgba(167, 150, 203, 0.2);
      }
      @media (max-width: 768px) {
          .controls-section, .concepts-equations {
              grid-template-columns: 1fr;
          }
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <h1>Interactive Pendulum Simulation</h1>
          <p style="font-size: 1.2em; opacity: 0.9;">Energy conservation and harmonic motion analysis</p>
      </div>
      
      <div class="canvas-container">
          <canvas id="canvas" width="800" height="400"></canvas>
      </div>
      
      <div class="controls-section">
          <div class="control-group">
              <h3>🎮 Simulation Controls</h3>
              
              <div class="play-pause-controls">
                  <button class="control-btn" id="playPauseBtn">⏸️ Pause</button>
                  <button class="control-btn" id="resetBtn">🔄 Reset</button>
              </div>
              
              <div class="slider-container">
                  <label class="slider-label">Length (m)</label>
                  <input type="range" class="slider" id="length" min="0.5" max="3" value="1.5" step="0.1">
                  <div class="value-display" id="lengthValue">1.5 m</div>
              </div>
              
              <div class="slider-container">
                  <label class="slider-label">Initial Angle (°)</label>
                  <input type="range" class="slider" id="angle" min="5" max="60" value="30" step="1">
                  <div class="value-display" id="angleValue">30°</div>
              </div>
          </div>
          
          <div class="control-group">
              <h3>⚙️ Physics Parameters</h3>
              
              <div class="slider-container">
                  <label class="slider-label">Gravity (m/s²)</label>
                  <input type="range" class="slider" id="gravity" min="1" max="15" value="9.8" step="0.1">
                  <div class="value-display" id="gravityValue">9.8 m/s²</div>
              </div>
              
              <div class="slider-container">
                  <label class="slider-label">Damping</label>
                  <input type="range" class="slider" id="damping" min="0" max="0.02" value="0.001" step="0.001">
                  <div class="value-display" id="dampingValue">0.001</div>
              </div>
          </div>
      </div>
      
      <div class="physics-values">
          <h3>📊 Real-Time Physics Values</h3>
          <div class="physics-grid">
              <div class="physics-item">
                  <div class="physics-label">Current Angle</div>
                  <div class="physics-value" id="currentAngle">30.0°</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Angular Velocity</div>
                  <div class="physics-value" id="angularVel">0.00 rad/s</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Kinetic Energy</div>
                  <div class="physics-value" id="kineticEnergy">0.00 J</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Potential Energy</div>
                  <div class="physics-value" id="potentialEnergy">0.00 J</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Total Energy</div>
                  <div class="physics-value" id="totalEnergy">0.00 J</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Period</div>
                  <div class="physics-value" id="period">0.00 s</div>
              </div>
          </div>
      </div>
      
      <div class="concepts-equations">
          <div class="concepts-section">
              <h3>🧠 Physics Concepts</h3>
              <div class="concept-item">
                  <strong>Simple Harmonic Motion:</strong> The pendulum exhibits periodic motion with restoring force proportional to displacement.
              </div>
              <div class="concept-item">
                  <strong>Energy Conservation:</strong> Total mechanical energy remains constant in the absence of damping.
              </div>
              <div class="concept-item">
                  <strong>Angular Displacement:</strong> The angle θ varies sinusoidally with time for small oscillations.
              </div>
          </div>
          
          <div class="equations-section">
              <h3>📐 Key Equations</h3>
              <div class="equation">
                  <strong>Period Formula:</strong><br>
                  T = 2π√(L/g)
              </div>
              <div class="equation">
                  <strong>Energy Conservation:</strong><br>
                  KE + PE = constant
              </div>
              <div class="equation">
                  <strong>Angular Frequency:</strong><br>
                  ω = √(g/L)
              </div>
          </div>
      </div>
  </div>

  <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      
      let isPlaying = true;
      let length = 1.5;
      let gravity = 9.8;
      let damping = 0.001;
      let initialAngle = 30 * Math.PI / 180;
      let currentAngle = initialAngle;
      let angularVelocity = 0;
      let mass = 1; // kg
      
      const scale = 150; // pixels per meter
      const originX = canvas.width / 2;
      const originY = 80;
      
      function updateValues() {
          length = parseFloat(document.getElementById('length').value);
          gravity = parseFloat(document.getElementById('gravity').value);
          damping = parseFloat(document.getElementById('damping').value);
          initialAngle = parseFloat(document.getElementById('angle').value) * Math.PI / 180;
          
          document.getElementById('lengthValue').textContent = length.toFixed(1) + ' m';
          document.getElementById('gravityValue').textContent = gravity.toFixed(1) + ' m/s²';
          document.getElementById('dampingValue').textContent = damping.toFixed(3);
          document.getElementById('angleValue').textContent = (initialAngle * 180 / Math.PI).toFixed(0) + '°';
      }
      
      function resetPendulum() {
          currentAngle = initialAngle;
          angularVelocity = 0;
      }
      
      function updatePhysics() {
          if (!isPlaying) return;
          
          const angularAcceleration = -(gravity / length) * Math.sin(currentAngle) - damping * angularVelocity;
          angularVelocity += angularAcceleration * 0.016;
          currentAngle += angularVelocity * 0.016;
          
          // Calculate energies
          const height = length * (1 - Math.cos(currentAngle));
          const potentialEnergy = mass * gravity * height;
          const kineticEnergy = 0.5 * mass * Math.pow(length * angularVelocity, 2);
          const totalEnergy = potentialEnergy + kineticEnergy;
          const period = 2 * Math.PI * Math.sqrt(length / gravity);
          
          // Update display values
          document.getElementById('currentAngle').textContent = (currentAngle * 180 / Math.PI).toFixed(1) + '°';
          document.getElementById('angularVel').textContent = angularVelocity.toFixed(2) + ' rad/s';
          document.getElementById('kineticEnergy').textContent = kineticEnergy.toFixed(2) + ' J';
          document.getElementById('potentialEnergy').textContent = potentialEnergy.toFixed(2) + ' J';
          document.getElementById('totalEnergy').textContent = totalEnergy.toFixed(2) + ' J';
          document.getElementById('period').textContent = period.toFixed(2) + ' s';
      }
      
      function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw pendulum string
          const bobX = originX + length * scale * Math.sin(currentAngle);
          const bobY = originY + length * scale * Math.cos(currentAngle);
          
          ctx.strokeStyle = '#7962A6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(bobX, bobY);
          ctx.stroke();
          
          // Draw pivot point
          ctx.fillStyle = '#A796CB';
          ctx.beginPath();
          ctx.arc(originX, originY, 8, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw pendulum bob
          ctx.fillStyle = '#7962A6';
          ctx.beginPath();
          ctx.arc(bobX, bobY, 20, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#A796CB';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Draw angle arc
          ctx.strokeStyle = 'rgba(121, 98, 166, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(originX, originY, 50, 0, currentAngle);
          ctx.stroke();
          
          // Draw velocity vector
          const velScale = 50;
          const velX = bobX + angularVelocity * velScale * Math.cos(currentAngle);
          const velY = bobY - angularVelocity * velScale * Math.sin(currentAngle);
          
          ctx.strokeStyle = '#FF6B6B';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(bobX, bobY);
          ctx.lineTo(velX, velY);
          ctx.stroke();
          
          // Draw labels
          ctx.fillStyle = '#7962A6';
          ctx.font = 'bold 14px Arial';
          ctx.fillText('Velocity', velX + 5, velY - 5);
          ctx.fillText(\`L = \${length.toFixed(1)}m\`, originX + 10, originY + 20);
      }
      
      function animate() {
          updatePhysics();
          draw();
          requestAnimationFrame(animate);
      }
      
      // Event listeners
      document.getElementById('playPauseBtn').addEventListener('click', () => {
          isPlaying = !isPlaying;
          document.getElementById('playPauseBtn').textContent = isPlaying ? '⏸️ Pause' : '▶️ Play';
      });
      
      document.getElementById('resetBtn').addEventListener('click', resetPendulum);
      
      ['length', 'angle', 'gravity', 'damping'].forEach(id => {
          document.getElementById(id).addEventListener('input', updateValues);
      });
      
      // Keyboard controls
      document.addEventListener('keydown', (e) => {
          if (e.code === 'Space') {
              e.preventDefault();
              document.getElementById('playPauseBtn').click();
          } else if (e.code === 'KeyR') {
              resetPendulum();
          }
      });
      
      updateValues();
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
      .canvas-container {
          text-align: center;
          margin-bottom: 30px;
      }
      canvas {
          border: 3px solid #7962A6;
          border-radius: 15px;
          background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%);
          box-shadow: 0 10px 30px rgba(121, 98, 166, 0.3);
      }
      .controls-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
      }
      .control-group {
          background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
          border-radius: 15px;
          padding: 25px;
          border: 1px solid rgba(167, 150, 203, 0.3);
      }
      .control-group h3 {
          margin: 0 0 20px 0;
          color: #7962A6;
          font-size: 1.3em;
          border-bottom: 2px solid #A796CB;
          padding-bottom: 10px;
      }
      .play-pause-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
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
      .slider-container {
          margin-bottom: 15px;
      }
      .slider-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #7962A6;
      }
      .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(167, 150, 203, 0.2);
          outline: none;
          -webkit-appearance: none;
          accent-color: #7962A6;
      }
      .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #7962A6, #A796CB);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(121, 98, 166, 0.3);
      }
      .value-display {
          background: linear-gradient(135deg, #A796CB20 0%, #7962A620 100%);
          padding: 8px 12px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          text-align: center;
          margin-top: 8px;
          color: #7962A6;
          border: 1px solid rgba(167, 150, 203, 0.3);
      }
      .physics-values {
          background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 30px;
          border: 1px solid rgba(167, 150, 203, 0.3);
      }
      .physics-values h3 {
          color: #7962A6;
          margin-bottom: 20px;
          font-size: 1.3em;
          text-align: center;
          border-bottom: 2px solid #A796CB;
          padding-bottom: 10px;
      }
      .physics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
      }
      .physics-item {
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 10px;
          border: 1px solid rgba(167, 150, 203, 0.2);
      }
      .physics-label {
          font-weight: 600;
          color: #7962A6;
          font-size: 0.9em;
          margin-bottom: 5px;
      }
      .physics-value {
          font-family: 'Courier New', monospace;
          color: #333;
          font-weight: bold;
          font-size: 1.1em;
      }
      .concepts-equations {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
      }
      .concepts-section, .equations-section {
          background: linear-gradient(135deg, #A796CB10 0%, #7962A610 100%);
          padding: 25px;
          border-radius: 15px;
          border: 1px solid rgba(167, 150, 203, 0.3);
      }
      .concepts-section h3, .equations-section h3 {
          color: #7962A6;
          margin-bottom: 20px;
          font-size: 1.3em;
          border-bottom: 2px solid #A796CB;
          padding-bottom: 10px;
      }
      .concept-item {
          background: rgba(255, 255, 255, 0.8);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 10px;
          border: 1px solid rgba(167, 150, 203, 0.2);
      }
      .equation {
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
          text-align: center;
          font-family: 'Times New Roman', serif;
          font-size: 1.1em;
          border: 1px solid rgba(167, 150, 203, 0.2);
      }
      @media (max-width: 768px) {
          .controls-section, .concepts-equations {
              grid-template-columns: 1fr;
          }
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <h1>Projectile Motion Simulator</h1>
          <p style="font-size: 1.2em; opacity: 0.9;">Vector physics and trajectory analysis</p>
      </div>
      
      <div class="canvas-container">
          <canvas id="canvas" width="800" height="400"></canvas>
      </div>
      
      <div class="controls-section">
          <div class="control-group">
              <h3>🎮 Launch Controls</h3>
              
              <div class="play-pause-controls">
                  <button class="control-btn" id="playPauseBtn">⏸️ Pause</button>
                  <button class="control-btn" id="resetBtn">🔄 Reset</button>
                  <button class="control-btn" id="launchBtn">🚀 Launch</button>
              </div>
              
              <div class="slider-container">
                  <label class="slider-label">Launch Angle (°)</label>
                  <input type="range" class="slider" id="angle" min="5" max="85" value="45" step="1">
                  <div class="value-display" id="angleValue">45°</div>
              </div>
              
              <div class="slider-container">
                  <label class="slider-label">Initial Velocity (m/s)</label>
                  <input type="range" class="slider" id="velocity" min="10" max="100" value="50" step="1">
                  <div class="value-display" id="velocityValue">50 m/s</div>
              </div>
          </div>
          
          <div class="control-group">
              <h3>⚙️ Environment</h3>
              
              <div class="slider-container">
                  <label class="slider-label">Gravity (m/s²)</label>
                  <input type="range" class="slider" id="gravity" min="1" max="15" value="9.8" step="0.1">
                  <div class="value-display" id="gravityValue">9.8 m/s²</div>
              </div>
              
              <div class="slider-container">
                  <label class="slider-label">Air Resistance</label>
                  <input type="range" class="slider" id="airRes" min="0" max="0.01" value="0.001" step="0.0001">
                  <div class="value-display" id="airResValue">0.001</div>
              </div>
          </div>
      </div>
      
      <div class="physics-values">
          <h3>📊 Real-Time Physics Values</h3>
          <div class="physics-grid">
              <div class="physics-item">
                  <div class="physics-label">Horizontal Velocity</div>
                  <div class="physics-value" id="vx">0.00 m/s</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Vertical Velocity</div>
                  <div class="physics-value" id="vy">0.00 m/s</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Total Velocity</div>
                  <div class="physics-value" id="totalVel">0.00 m/s</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Height</div>
                  <div class="physics-value" id="height">0.00 m</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Range</div>
                  <div class="physics-value" id="range">0.00 m</div>
              </div>
              <div class="physics-item">
                  <div class="physics-label">Flight Time</div>
                  <div class="physics-value" id="flightTime">0.00 s</div>
              </div>
          </div>
      </div>
      
      <div class="concepts-equations">
          <div class="concepts-section">
              <h3>🧠 Physics Concepts</h3>
              <div class="concept-item">
                  <strong>Vector Components:</strong> Velocity has horizontal (vₓ) and vertical (vᵧ) components that change independently.
              </div>
              <div class="concept-item">
                  <strong>Parabolic Trajectory:</strong> The path follows a parabola due to constant horizontal velocity and accelerating vertical motion.
              </div>
              <div class="concept-item">
                  <strong>Air Resistance:</strong> Drag force opposes motion, reducing both horizontal and vertical velocity components.
              </div>
          </div>
          
          <div class="equations-section">
              <h3>📐 Key Equations</h3>
              <div class="equation">
                  <strong>Horizontal Motion:</strong><br>
                  x = v₀cos(θ)t
              </div>
              <div class="equation">
                  <strong>Vertical Motion:</strong><br>
                  y = v₀sin(θ)t - ½gt²
              </div>
              <div class="equation">
                  <strong>Range Formula:</strong><br>
                  R = v₀²sin(2θ)/g
              </div>
          </div>
      </div>
  </div>

  <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      
      let isPlaying = false;
      let projectile = null;
      let trail = [];
      let startTime = 0;
      
      let angle = 45;
      let velocity = 50;
      let gravity = 9.8;
      let airResistance = 0.001;
      
      const scale = 5; // pixels per meter
      const groundY = canvas.height - 50;
      const launchX = 50;
      const launchY = groundY;
      
      function updateValues() {
          angle = parseFloat(document.getElementById('angle').value);
          velocity = parseFloat(document.getElementById('velocity').value);
          gravity = parseFloat(document.getElementById('gravity').value);
          airResistance = parseFloat(document.getElementById('airRes').value);
          
          document.getElementById('angleValue').textContent = angle + '°';
          document.getElementById('velocityValue').textContent = velocity + ' m/s';
          document.getElementById('gravityValue').textContent = gravity.toFixed(1) + ' m/s²';
          document.getElementById('airResValue').textContent = airResistance.toFixed(4);
      }
      
      function launchProjectile() {
          const angleRad = angle * Math.PI / 180;
          projectile = {
              x: launchX / scale,
              y: (canvas.height - launchY) / scale,
              vx: velocity * Math.cos(angleRad),
              vy: velocity * Math.sin(angleRad),
              launched: true
          };
          trail = [];
          startTime = Date.now();
          isPlaying = true;
          document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
      }
      
      function resetProjectile() {
          projectile = null;
          trail = [];
          isPlaying = false;
          startTime = 0;
          document.getElementById('playPauseBtn').textContent = '▶️ Play';
          updatePhysicsDisplay();
      }
      
      function updatePhysics() {
          if (!isPlaying || !projectile || !projectile.launched) return;
          
          const dt = 0.016; // 60 FPS
          
          // Apply gravity
          projectile.vy -= gravity * dt;
          
          // Apply air resistance
          const speed = Math.sqrt(projectile.vx * projectile.vx + projectile.vy * projectile.vy);
          const dragX = -airResistance * projectile.vx * speed;
          const dragY = -airResistance * projectile.vy * speed;
          
          projectile.vx += dragX * dt;
          projectile.vy += dragY * dt;
          
          // Update position
          projectile.x += projectile.vx * dt;
          projectile.y += projectile.vy * dt;
          
          // Add to trail
          trail.push({ x: projectile.x * scale, y: canvas.height - projectile.y * scale });
          if (trail.length > 200) trail.shift();
          
          // Check ground collision
          if (projectile.y <= 0) {
              projectile.y = 0;
              projectile.launched = false;
              isPlaying = false;
              document.getElementById('playPauseBtn').textContent = '▶️ Play';
          }
          
          updatePhysicsDisplay();
      }
      
      function updatePhysicsDisplay() {
          if (projectile && projectile.launched) {
              const totalVel = Math.sqrt(projectile.vx * projectile.vx + projectile.vy * projectile.vy);
              const flightTime = (Date.now() - startTime) / 1000;
              
              document.getElementById('vx').textContent = projectile.vx.toFixed(2) + ' m/s';
              document.getElementById('vy').textContent = projectile.vy.toFixed(2) + ' m/s';
              document.getElementById('totalVel').textContent = totalVel.toFixed(2) + ' m/s';
              document.getElementById('height').textContent = projectile.y.toFixed(2) + ' m';
              document.getElementById('range').textContent = projectile.x.toFixed(2) + ' m';
              document.getElementById('flightTime').textContent = flightTime.toFixed(2) + ' s';
          } else {
              document.getElementById('vx').textContent = '0.00 m/s';
              document.getElementById('vy').textContent = '0.00 m/s';
              document.getElementById('totalVel').textContent = '0.00 m/s';
              document.getElementById('height').textContent = '0.00 m';
              document.getElementById('range').textContent = '0.00 m';
              document.getElementById('flightTime').textContent = '0.00 s';
          }
      }
      
      function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw ground
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
          
          // Draw trajectory trail
          if (trail.length > 1) {
              ctx.strokeStyle = 'rgba(121, 98, 166, 0.6)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(trail[0].x, trail[0].y);
              for (let i = 1; i < trail.length; i++) {
                  ctx.lineTo(trail[i].x, trail[i].y);
              }
              ctx.stroke();
          }
          
          // Draw launch cannon
          ctx.fillStyle = '#7962A6';
          ctx.save();
          ctx.translate(launchX, launchY);
          ctx.rotate(-angle * Math.PI / 180);
          ctx.fillRect(-5, -10, 40, 20);
          ctx.restore();
          
          // Draw projectile
          if (projectile && projectile.launched) {
              const screenX = projectile.x * scale;
              const screenY = canvas.height - projectile.y * scale;
              
              ctx.fillStyle = '#FF6B6B';
              ctx.beginPath();
              ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI);
              ctx.fill();
              
              // Draw velocity vector
              const velScale = 2;
              ctx.strokeStyle = '#FF6B6B';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.lineTo(screenX + projectile.vx * velScale, screenY - projectile.vy * velScale);
              ctx.stroke();
              
              // Draw velocity components
              ctx.strokeStyle = '#00FF00';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.lineTo(screenX + projectile.vx * velScale, screenY);
              ctx.stroke();
              
              ctx.strokeStyle = '#0000FF';
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.lineTo(screenX, screenY - projectile.vy * velScale);
              ctx.stroke();
          }
          
          // Draw angle indicator
          ctx.strokeStyle = 'rgba(121, 98, 166, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(launchX, launchY, 30, 0, -angle * Math.PI / 180, true);
          ctx.stroke();
          
          // Draw labels
          ctx.fillStyle = '#7962A6';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(\`θ = \${angle}°\`, launchX + 35, launchY - 10);
          ctx.fillText(\`v₀ = \${velocity} m/s\`, launchX + 35, launchY + 10);
      }
      
      function animate() {
          updatePhysics();
          draw();
          requestAnimationFrame(animate);
      }
      
      // Event listeners
      document.getElementById('playPauseBtn').addEventListener('click', () => {
          if (projectile && projectile.launched) {
              isPlaying = !isPlaying;
              document.getElementById('playPauseBtn').textContent = isPlaying ? '⏸️ Pause' : '▶️ Play';
          }
      });
      
      document.getElementById('resetBtn').addEventListener('click', resetProjectile);
      document.getElementById('launchBtn').addEventListener('click', launchProjectile);
      
      ['angle', 'velocity', 'gravity', 'airRes'].forEach(id => {
          document.getElementById(id).addEventListener('input', updateValues);
      });
      
      // Keyboard controls
      document.addEventListener('keydown', (e) => {
          if (e.code === 'Space') {
              e.preventDefault();
              if (projectile && projectile.launched) {
                  document.getElementById('playPauseBtn').click();
              } else {
                  launchProjectile();
              }
          } else if (e.code === 'KeyR') {
              resetProjectile();
          }
      });
      
      updateValues();
      animate();
  </script>
</body>
</html>`,

  moments: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moment Physics Simulation</title>
    <style>
        /* Basic Reset and Body Styles */
        body {
            margin: 0;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        /* Utility Classes (mimicking Tailwind) */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .gap-4 { gap: 1rem; } /* 16px */
        .gap-8 { gap: 2rem; } /* 32px */
        .w-full { width: 100%; }
        .max-w-none { max-width: none; }
        .min-h-screen { min-height: 100vh; }
        .p-4 { padding: 1rem; } /* 16px */
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
        .text-xs { font-size: 0.75rem; line-height: 1rem; } /* 12px */
        .text-\[10px\] { font-size: 10px; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .text-center { text-align: center; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .overflow-hidden { overflow: hidden; }
        .border-2 { border-width: 2px; }
        .rounded-lg { border-radius: 0.5rem; } /* 8px */
        .rounded-sm { border-radius: 0.125rem; } /* 2px */
        .rounded-full { border-radius: 9999px; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .h-1 { height: 0.25rem; } /* 4px */
        .h-2 { height: 0.5rem; } /* 8px */
        .h-5 { height: 1.25rem; } /* 20px */
        .h-6 { height: 1.5rem; } /* 24px */
        .w-5 { width: 1.25rem; } /* 20px */
        .w-6 { width: 1.5rem; } /* 24px */
        .w-0 { width: 0; }
        .z-5 { z-index: 5; }
        .z-7 { z-index: 7; }
        .z-8 { z-index: 8; }
        .z-10 { z-index: 10; }
        .z-12 { z-index: 12; }
        .z-14 { z-index: 14; }
        .z-15 { z-index: 15; }
        .z-20 { z-index: 20; }
        .-translate-x-1-2 { transform: translateX(-50%); }
        .white-space-nowrap { white-space: nowrap; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        .grid { display: grid; }
        /* Colors */
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-gray-50 { background-color: #f9fafb; }
        .bg-gray-600 { background-color: #4b5563; }
        .bg-gray-700 { background-color: #374151; }
        .bg-gray-800 { background-color: #1f2937; }
        .bg-gray-900 { background-color: #111827; }
        .bg-white { background-color: #ffffff; }
        .bg-blue-500 { background-color: #3b82f6; }
        .text-gray-900 { color: #111827; }
        .text-gray-800 { color: #1f2937; }
        .text-gray-700 { color: #374151; }
        .text-gray-600 { color: #4b5563; }
        .text-green-600 { color: #16a34a; }
        .text-purple-600 { color: #9333ea; }
        .text-orange-600 { color: #ea580c; }
        .border-gray-300 { border-color: #d1d5db; }
        .border-gray-500 { border-color: #6b7280; }
        .border-b-gray-500 { border-bottom-color: #6b7280; }
        /* Dark Mode Colors */
        @media (prefers-color-scheme: dark) {
            .dark\:bg-gray-900 { background-color: #111827; }
            .dark\:bg-gray-800 { background-color: #1f2937; }
            .dark\:bg-gray-700 { background-color: #374151; }
            .dark\:bg-gray-400 { background-color: #9ca3af; }
            .dark\:bg-gray-300 { background-color: #d1d5db; }
            .dark\:bg-blue-400 { background-color: #60a5fa; }
            .dark\:text-gray-100 { color: #f3f4f6; }
            .dark\:text-gray-200 { color: #e5e7eb; }
            .dark\:text-gray-300 { color: #d1d5db; }
            .dark\:text-gray-400 { color: #9ca3af; }
            .dark\:text-green-400 { color: #4ade80; }
            .dark\:text-purple-400 { color: #c084fc; }
            .dark\:text-orange-400 { color: #fb923c; }
            .dark\:border-gray-700 { border-color: #374151; }
            .dark\:border-b-gray-400 { border-bottom-color: #9ca3af; }
        }
        /* Shadcn/ui Button styles */
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            border-radius: 0.375rem; /* 6px */
            font-size: 0.875rem; /* 14px */
            font-weight: 500;
            height: 2.5rem; /* 40px */
            padding: 0 1rem; /* 16px */
            background-color: #000; /* Primary color */
            color: #fff; /* Text color */
            border: 1px solid transparent;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s;
        }
        .button:hover { background-color: #333; /* Darker on hover */ }
        .button:disabled { opacity: 0.5; cursor: not-allowed; }
        /* Shadcn/ui Card styles */
        .card {
            border-radius: 0.5rem; /* 8px */
            border: 1px solid #e5e7eb; /* border-gray-200 */
            background-color: #fff; /* bg-white */
            color: #020817; /* text-gray-950 */
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-sm */
        }
        .dark .card {
            border-color: #27272a; /* dark:border-gray-800 */
            background-color: #18181b; /* dark:bg-gray-950 */
            color: #fafafa; /* dark:text-gray-50 */
        }
        .card-header {
            display: flex;
            flex-direction: column;
            padding: 1.5rem; /* 24px */
        }
        .card-title {
            font-size: 1.5rem; /* 24px */
            font-weight: 600;
            line-height: 1.2;
            letter-spacing: -0.025em; /* tracking-tight */
        }
        .card-content {
            padding: 1.5rem; /* 24px */
            padding-top: 0;
        }
        /* Shadcn/ui Label styles */
        .label {
            font-size: 0.875rem; /* 14px */
            font-weight: 500;
            line-height: 1;
            color: #020817; /* text-gray-950 */
        }
        .dark .label { color: #fafafa; /* dark:text-gray-50 */ }
        /* Shadcn/ui Slider styles */
        .slider-container {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            height: 20px; /* Adjust height for better clickability */
            cursor: pointer;
            touch-action: none;
            user-select: none;
        }
        .slider-track {
            position: relative;
            background-color: #e2e8f0; /* bg-gray-200 */
            border-radius: 9999px;
            height: 8px; /* h-2 */
            width: 100%;
        }
        .dark .slider-track { background-color: #3f3f46; /* dark:bg-gray-700 */ }
        .slider-range {
            position: absolute;
            background-color: #000; /* bg-gray-900 */
            border-radius: 9999px;
            height: 100%;
        }
        .dark .slider-range { background-color: #fafafa; /* dark:bg-gray-50 */ }
        .slider-thumb {
            display: block;
            width: 20px; /* h-5 w-5 */
            height: 20px;
            background-color: #fff; /* bg-white */
            border: 2px solid #000; /* border-gray-900 */
            border-radius: 9999px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* shadow */
            transition: transform 0.2s;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: grab;
        }
        .dark .slider-thumb {
            background-color: #020817; /* dark:bg-gray-950 */
            border-color: #fafafa; /* dark:border-gray-50 */
        }
        .slider-thumb:focus-visible {
            outline: 2px solid #2563eb; /* ring-blue-600 */
            outline-offset: 2px;
        }
        .slider-thumb:active { cursor: grabbing; }
        /* Specific styles for the simulation elements */
        #simulationDisplay {
            max-width: 700px; /* simulationWidth */
            height: 400px; /* simulationHeight */
        }
        #ground {
            top: calc(400px - 50px); /* groundLevelY */
            left: 0;
            z-index: 7;
        }
        #pivotStand {
            left: calc(50% - 30px); /* centerX - 30px */
            top: calc(calc(400px - 50px) + 10px); /* fixedPivotY + 10px */
            z-index: 5;
        }
        #pivotPoint {
            left: calc(50% - 12px); /* centerX - 12px */
            top: calc(calc(400px - 50px) - 12px); /* fixedPivotY - 12px */
            z-index: 10;
        }
        #beam {
            width: 400px; /* beamLength */
            height: 4px; /* beamThickness */
            transform-origin: 200px 2px; /* beamLength / 2, beamThickness / 2 */
            left: calc(50% - 200px); /* centerX - beamLength / 2 */
            top: calc(calc(400px - 50px) - 2px); /* fixedPivotY - beamThickness / 2 */
            z-index: 8;
        }
        /* Force Arrow specific styles */
        .force-arrow-container {
            position: absolute;
            transform-origin: 0 0;
            z-index: 15;
        }
        .force-arrow-line { height: 4px; /* h-1 */ }
        .force-arrow-head {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 12px solid;
            transform: rotate(-90deg);
            top: -6px;
        }
        .force-text {
            position: absolute;
            font-size: 0.75rem; /* text-xs */
            font-weight: 700;
            white-space: nowrap;
        }
        /* Component Force styles */
        .component-force-container {
            position: absolute;
            transform-origin: 0 0;
            z-index: 14;
        }
        .component-force-line { height: 1px; }
        .component-force-head {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 9px solid;
            transform: rotate(-90deg);
            top: -4.5px;
        }
        .component-force-text {
            position: absolute;
            font-size: 10px; /* text-[10px] */
            font-weight: 700;
            white-space: nowrap;
        }
    </style>
</head>
<body class="bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
        Moment Physics Simulation
    </h1>
    <div class="flex flex-col items-center gap-8 w-full max-w-none">
        <!-- Simulation Control Buttons -->
        <div class="flex justify-center gap-4 mt-4 mb-4">
            <button id="startButton" class="button">Start Simulation</button>
            <button id="pauseButton" class="button">Pause Simulation</button>
            <button id="resetButton" class="button">Reset All</button>
        </div>
        <!-- Simulation Display -->
        <div id="simulationDisplay" class="relative flex items-center justify-center overflow-hidden border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg w-full h-[400px]">
            <!-- Beam Length Indicator -->
            <div class="absolute top-4 left-1/2 -translate-x-1-2 z-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Beam Length: <span id="beamLengthDisplay"></span> m
                <div class="w-full h-1 bg-gray-500 dark:bg-gray-400 mt-1"></div>
            </div>
            <!-- Ground -->
            <div id="ground" class="absolute w-full h-2 bg-gray-600 dark:bg-gray-300"></div>
            <!-- Pivot Stand (Triangle) -->
            <div id="pivotStand" class="absolute w-0 h-0 border-l-[30px] border-r-[30px] border-b-[40px] border-l-transparent border-r-transparent border-b-gray-500 dark:border-b-gray-400"></div>
            <!-- Pivot Point (Small circle on top of triangle) -->
            <div id="pivotPoint" class="absolute w-6 h-6 bg-gray-700 dark:bg-gray-300 rounded-full"></div>
            <!-- Beam -->
            <div id="beam" class="absolute h-1 bg-blue-500 dark:bg-blue-400 rounded-sm"></div>
            <!-- Force Application Objects and Arrows will be dynamically added here by JS -->
            <div id="forcesContainer"></div>
        </div>
        <div class="text-lg font-medium text-gray-800 dark:text-gray-200">
            Total Net Torque: <span id="totalTorqueDisplay" class="font-bold">0.00 Nm</span>
        </div>
        <!-- Simulation Controls -->
        <div class="card w-full lg:w-3/4 min-w-[280px]">
            <div class="card-header">
                <h2 class="card-title">Simulation Controls</h2>
            </div>
            <div id="forceControlsContainer" class="card-content grid gap-4">
                <!-- Force controls will be dynamically added here by JS -->
            </div>
        </div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Fixed dimensions for the internal coordinate system of the simulation
            const simulationWidth = 700; // pixels
            const simulationHeight = 400; // pixels
            const beamLength = 400; // pixels (visual length of the beam)
            const beamThickness = 4; // pixels (new thinner beam height)
            const momentOfInertia = 5000; // Arbitrary value, adjust for desired responsiveness
            const dampingFactor = 0.995; // Simulates friction
            // Fixed pivot position
            const fixedPivotOffset = beamLength / 2; // Pivot is at the center of the beam
            const groundLevelY = simulationHeight - 50; // 50px from bottom of simulation container
            const fixedPivotY = groundLevelY - 50; // Y-coordinate of the pivot point, adjusted so triangle base is on ground
            // Initial forces
            const INITIAL_FORCES = [
                { id: 1, magnitude: 0, angle: 270, position: 50 }, // Force 1: 50px from left end
                { id: 2, magnitude: 0, angle: 270, position: 350 }, // Force 2: 50px from right end (beamLength - 50)
            ];
            // State variables
            let forces = JSON.parse(JSON.stringify(INITIAL_FORCES)); // Deep copy to avoid mutation issues
            let beamAngle = 0; // Degrees
            let isRunning = false; // Controls simulation play/pause
            let totalTorque = 0; // Display total torque
            let angularVelocity = 0;
            let lastTime = 0;
            let animationFrameId = null;
            // DOM Elements
            const simulationDisplay = document.getElementById("simulationDisplay");
            const beamLengthDisplay = document.getElementById("beamLengthDisplay");
            const groundElement = document.getElementById("ground");
            const pivotStand = document.getElementById("pivotStand");
            const pivotPoint = document.getElementById("pivotPoint");
            const beamElement = document.getElementById("beam");
            const forcesContainer = document.getElementById("forcesContainer");
            const totalTorqueDisplay = document.getElementById("totalTorqueDisplay");
            const forceControlsContainer = document.getElementById("forceControlsContainer");
            const startButton = document.getElementById("startButton");
            const pauseButton = document.getElementById("pauseButton");
            const resetButton = document.getElementById("resetButton");
            // Set initial static element positions and sizes
            simulationDisplay.style.maxWidth = \`\${simulationWidth}px\`;
            groundElement.style.top = \`\${groundLevelY}px\`;
            pivotStand.style.left = \`calc(\${simulationWidth / 2}px - 30px)\`;
            pivotStand.style.top = \`calc(\${fixedPivotY}px + 10px)\`;
            pivotPoint.style.left = \`calc(\${simulationWidth / 2}px - 12px)\`;
            pivotPoint.style.top = \`calc(\${fixedPivotY}px - 12px)\`;
            beamElement.style.width = \`\${beamLength}px\`;
            beamElement.style.left = \`\${simulationWidth / 2 - beamLength / 2}px\`;
            beamElement.style.top = \`\${fixedPivotY - beamThickness / 2}px\`;
            beamElement.style.transformOrigin = \`\${beamLength / 2}px \${beamThickness / 2}px\`;
            beamLengthDisplay.textContent = (beamLength / 100).toFixed(2);
            // Helper to create a slider
            function createSlider(id, labelText, min, max, step, initialValue, onChange) {
                const div = document.createElement("div");
                div.className = "grid gap-2 mb-4 border p-4 rounded-md bg-gray-50 dark:bg-gray-700";
                const h3 = document.createElement("h3");
                h3.className = "text-lg font-semibold";
                h3.textContent = labelText;
                // div.appendChild(h3); // Removed as labelText now includes the label for the slider itself
                const labelDiv = document.createElement("div");
                const label = document.createElement("label");
                label.htmlFor = id;
                label.className = "label";
                label.textContent = \`\${labelText.split(":")[0]}: \${initialValue.toFixed(1)}\`; // Initial text
                labelDiv.appendChild(label);
                div.appendChild(labelDiv);
                const sliderContainer = document.createElement("div");
                sliderContainer.className = "slider-container w-full";
                const sliderTrack = document.createElement("div");
                sliderTrack.className = "slider-track";
                sliderContainer.appendChild(sliderTrack);
                const sliderRange = document.createElement("div");
                sliderRange.className = "slider-range";
                sliderTrack.appendChild(sliderRange);
                const sliderThumb = document.createElement("div");
                sliderThumb.className = "slider-thumb";
                sliderThumb.setAttribute("role", "slider");
                sliderThumb.setAttribute("aria-valuemin", min);
                sliderThumb.setAttribute("aria-valuemax", max);
                sliderThumb.setAttribute("aria-valuenow", initialValue);
                sliderThumb.setAttribute("tabindex", "0");
                sliderTrack.appendChild(sliderThumb);
                div.appendChild(sliderContainer);
                let isDragging = false;
                const updateSlider = (value) => {
                    const percentage = ((value - min) / (max - min)) * 100;
                    sliderRange.style.width = \`\${percentage}%\`;
                    sliderThumb.style.left = \`calc(\${percentage}% - \${sliderThumb.offsetWidth / 2}px)\`;
                    label.textContent = \`\${labelText.split(":")[0]}: \${value.toFixed(1)}\`;
                    sliderThumb.setAttribute("aria-valuenow", value);
                };
                updateSlider(initialValue);
                const getSliderValue = (e) => {
                    const rect = sliderTrack.getBoundingClientRect();
                    let clientX = e.clientX;
                    if (e.touches && e.touches.length > 0) {
                        clientX = e.touches[0].clientX;
                    }
                    const clickX = clientX - rect.left;
                    let value = (clickX / rect.width) * (max - min) + min;
                    value = Math.round(value / step) * step;
                    return Math.max(min, Math.min(max, value));
                };
                const onPointerDown = (e) => {
                    isDragging = true;
                    sliderThumb.focus();
                    const value = getSliderValue(e);
                    updateSlider(value);
                    onChange(value);
                };
                const onPointerMove = (e) => {
                    if (!isDragging) return;
                    const value = getSliderValue(e);
                    updateSlider(value);
                    onChange(value);
                };
                const onPointerUp = () => {
                    isDragging = false;
                };
                sliderContainer.addEventListener("mousedown", onPointerDown);
                sliderContainer.addEventListener("touchstart", onPointerDown, { passive: true });
                document.addEventListener("mousemove", onPointerMove);
                document.addEventListener("touchmove", onPointerMove, { passive: true });
                document.addEventListener("mouseup", onPointerUp);
                document.addEventListener("touchend", onPointerUp);
                sliderThumb.addEventListener("keydown", (e) => {
                    let newValue = Number.parseFloat(sliderThumb.getAttribute("aria-valuenow"));
                    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                        newValue += step;
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                        newValue -= step;
                    } else {
                        return;
                    }
                    newValue = Math.max(min, Math.min(max, newValue));
                    updateSlider(newValue);
                    onChange(newValue);
                    e.preventDefault();
                });
                return { element: div, update: updateSlider };
            }
            // Function to render a force arrow
            function renderForceArrow(x, y, magnitude, angle, effectiveAngle, leverArm, color = "red", showComponents = true) {
                if (magnitude === 0) return null;
                const arrowLength = Math.min(magnitude * 1.5, 100); // Scale length, max 100px
                const torque = leverArm * magnitude * Math.sin(effectiveAngle * (Math.PI / 180));
                // Calculate component forces
                const angleRad = angle * (Math.PI / 180);
                const Fx = magnitude * Math.cos(angleRad);
                const Fy = magnitude * Math.sin(angleRad);
                // Determine if components should be shown (not perfectly horizontal/vertical)
                const isAngled = Math.abs(angle % 90) > 1 && Math.abs(angle % 90) < 89; // Tolerance for near 0, 90, 180, 270
                const container = document.createElement("div");
                container.className = "force-arrow-container";
                container.style.left = \`\${x}px\`;
                container.style.top = \`\${y}px\`;
                container.style.transform = \`rotate(\${angle}deg)\`;
                // Main Force Arrow Line
                const line = document.createElement("div");
                line.className = "force-arrow-line";
                line.style.width = \`\${arrowLength}px\`;
                line.style.backgroundColor = color;
                container.appendChild(line);
                // Main Force Arrow Head
                const head = document.createElement("div");
                head.className = "force-arrow-head";
                head.style.borderBottomColor = color;
                head.style.left = \`\${arrowLength - 8}px\`;
                container.appendChild(head);
                // Magnitude Text
                const magText = document.createElement("div");
                magText.className = "force-text text-gray-800 dark:text-gray-200";
                magText.style.left = \`\${arrowLength / 2}px\`;
                magText.style.top = \`-20px\`;
                magText.style.transform = \`rotate(-\${angle}deg)\`;
                magText.textContent = \`\${magnitude.toFixed(0)} N\`;
                container.appendChild(magText);
                // Lever Arm Text
                const leverArmText = document.createElement("div");
                leverArmText.className = "force-text text-green-600 dark:text-green-400";
                leverArmText.style.left = \`\${arrowLength / 2}px\`;
                leverArmText.style.top = \`10px\`;
                leverArmText.style.transform = \`rotate(-\${angle}deg)\`;
                leverArmText.textContent = \`r: \${Math.abs(leverArm / 100).toFixed(2)} m\`;
                container.appendChild(leverArmText);
                // Effective Angle Text
                const angleText = document.createElement("div");
                angleText.className = "force-text text-purple-600 dark:text-purple-400";
                angleText.style.left = \`\${arrowLength + 10}px\`;
                angleText.style.top = \`-5px\`;
                angleText.style.transform = \`rotate(-\${angle}deg)\`;
                angleText.textContent = \`θ: \${effectiveAngle.toFixed(0)}°\`;
                container.appendChild(angleText);
                // Torque Text
                const torqueText = document.createElement("div");
                torqueText.className = "force-text text-orange-600 dark:text-orange-400";
                torqueText.style.left = \`\${arrowLength + 10}px\`;
                torqueText.style.top = \`10px\`;
                torqueText.style.transform = \`rotate(-\${angle}deg)\`;
                torqueText.textContent = \`τ: \${torque.toFixed(2)} Nm\`;
                container.appendChild(torqueText);
                // Component Forces (Fx and Fy)
                if (showComponents && isAngled) {
                    // Fx Component
                    const fxContainer = document.createElement("div");
                    fxContainer.className = "component-force-container";
                    fxContainer.style.left = \`\${x}px\`;
                    fxContainer.style.top = \`\${y}px\`;
                    fxContainer.style.transform = \`rotate(\${Fx >= 0 ? 0 : 180}deg)\`;
                    const fxLine = document.createElement("div");
                    fxLine.className = "component-force-line bg-gray-500 dark:bg-gray-400";
                    fxLine.style.width = \`\${Math.abs(Fx) * 1.5}px\`;
                    fxContainer.appendChild(fxLine);
                    const fxHead = document.createElement("div");
                    fxHead.className = "component-force-head";
                    fxHead.style.borderBottomColor = "gray";
                    fxHead.style.left = \`\${Math.abs(Fx) * 1.5 - 6}px\`;
                    fxContainer.appendChild(fxHead);
                    const fxText = document.createElement("div");
                    fxText.className = "component-force-text text-gray-600 dark:text-gray-300";
                    fxText.style.left = \`\${(Math.abs(Fx) * 1.5) / 2}px\`;
                    fxText.style.top = \`-15px\`;
                    fxText.style.transform = \`rotate(-\${Fx >= 0 ? 0 : 180}deg)\`;
                    fxText.textContent = \`Fx: \${Math.abs(Fx).toFixed(1)} N\`;
                    fxContainer.appendChild(fxText);
                    container.appendChild(fxContainer); // Append to main force container
                    // Fy Component
                    const fyContainer = document.createElement("div");
                    fyContainer.className = "component-force-container";
                    fyContainer.style.left = \`\${x}px\`;
                    fyContainer.style.top = \`\${y}px\`;
                    fyContainer.style.transform = \`rotate(\${Fy >= 0 ? 90 : 270}deg)\`;
                    const fyLine = document.createElement("div");
                    fyLine.className = "component-force-line bg-gray-500 dark:bg-gray-400";
                    fyLine.style.width = \`\${Math.abs(Fy) * 1.5}px\`;
                    fyContainer.appendChild(fyLine);
                    const fyHead = document.createElement("div");
                    fyHead.className = "component-force-head";
                    fyHead.style.borderBottomColor = "gray";
                    fyHead.style.left = \`\${Math.abs(Fy) * 1.5 - 6}px\`;
                    fyContainer.appendChild(fyHead);
                    const fyText = document.createElement("div");
                    fyText.className = "component-force-text text-gray-600 dark:text-gray-300";
                    fyText.style.left = \`\${(Math.abs(Fy) * 1.5) / 2}px\`;
                    fyText.style.top = Fy >= 0 ? \`-15px\` : \`10px\`;
                    fyText.style.transform = \`rotate(-\${Fy >= 0 ? 90 : 270}deg)\`;
                    fyText.textContent = \`Fy: \${Math.abs(Fy).toFixed(1)} N\`;
                    fyContainer.appendChild(fyText);
                    container.appendChild(fyContainer); // Append to main force container
                }
                return container;
            }
            // Function to update the UI based on current state
            function updateUI() {
                beamElement.style.transform = \`rotate(\${beamAngle}deg)\`;
                totalTorqueDisplay.textContent = \`\${totalTorque.toFixed(2)} Nm\`;
                // Clear existing forces and re-render
                forcesContainer.innerHTML = "";
                forces.forEach((f) => {
                    const centerX = simulationWidth / 2;
                    const pivotAbsX = centerX;
                    const pivotAbsY = fixedPivotY;
                    const forcePointRelativeToBeamCenter = f.position - beamLength / 2;
                    const forcePointRelativeToBeamCenterY = 0;
                    const angleRad = beamAngle * (Math.PI / 180);
                    const rotatedForcePointX =
                        forcePointRelativeToBeamCenter * Math.cos(angleRad) - forcePointRelativeToBeamCenterY * Math.sin(angleRad);
                    const rotatedForcePointY =
                        forcePointRelativeToBeamCenter * Math.sin(angleRad) + forcePointRelativeToBeamCenterY * Math.cos(angleRad);
                    const absForceX = pivotAbsX + rotatedForcePointX;
                    const absForceY = pivotAbsY + rotatedForcePointY;
                    let effectiveAngle = f.angle - beamAngle;
                    effectiveAngle = ((effectiveAngle % 360) + 360) % 360;
                    if (effectiveAngle > 180) effectiveAngle -= 360;
                    const leverArmForDisplay = f.position - fixedPivotOffset;
                    const forceArrowElement = renderForceArrow(
                        absForceX,
                        absForceY,
                        f.magnitude,
                        f.angle,
                        effectiveAngle,
                        leverArmForDisplay,
                        "red",
                        true,
                    );
                    if (forceArrowElement) {
                        forcesContainer.appendChild(forceArrowElement);
                        // Object at Force Application Point
                        const forceObject = document.createElement("div");
                        forceObject.className = "absolute w-5 h-5 bg-gray-600 dark:bg-gray-300 rounded-sm";
                        forceObject.style.left = \`\${absForceX - 10}px\`;
                        forceObject.style.top = \`\${absForceY - 10}px\`;
                        forceObject.style.zIndex = 12;
                        forcesContainer.appendChild(forceObject);
                    }
                });
                // Update slider values
                forceSliders.forEach((slider) => {
                    const force = forces.find((f) => f.id === slider.id);
                    if (force) {
                        slider.magnitudeSlider.update(force.magnitude);
                        slider.angleSlider.update(force.angle);
                        slider.positionSlider.update(force.position);
                    }
                });
                // Update button states
                startButton.disabled = isRunning;
                pauseButton.disabled = !isRunning;
            }
            // Simulation loop
            function simulate(time) {
                if (!lastTime) {
                    lastTime = time;
                }
                const deltaTime = (time - lastTime) / 1000; // Seconds
                lastTime = time;
                let currentTotalTorque = 0;
                forces.forEach((f) => {
                    const leverArm = f.position - fixedPivotOffset;
                    const angleRelativeToBeam = (f.angle - beamAngle) * (Math.PI / 180);
                    const torque_i = leverArm * f.magnitude * Math.sin(angleRelativeToBeam);
                    currentTotalTorque += torque_i;
                });
                totalTorque = currentTotalTorque; // Update total torque display
                const angularAcceleration = currentTotalTorque / momentOfInertia;
                angularVelocity += angularAcceleration * deltaTime;
                angularVelocity *= dampingFactor;
                if (Math.abs(angularVelocity) < 0.001 && Math.abs(currentTotalTorque) < 0.01) {
                    angularVelocity = 0;
                }
                let newBeamAngle = beamAngle + angularVelocity * deltaTime * (180 / Math.PI);
                newBeamAngle = (newBeamAngle + 360) % 360;
                if (newBeamAngle > 180) newBeamAngle -= 360;
                // Collision detection with ground
                const angleRadForCollision = newBeamAngle * (Math.PI / 180);
                const halfBeamLength = beamLength / 2;
                const y_left_end_rel_center = -halfBeamLength * Math.sin(angleRadForCollision);
                const y_right_end_rel_center = halfBeamLength * Math.sin(angleRadForCollision);
                const abs_y_left_end_bottom = fixedPivotY + y_left_end_rel_center + beamThickness / 2;
                const abs_y_right_end_bottom = fixedPivotY + y_right_end_rel_center + beamThickness / 2;
                if (abs_y_left_end_bottom >= groundLevelY || abs_y_right_end_bottom >= groundLevelY) {
                    angularVelocity = 0; // Stop rotation
                    totalTorque = 0; // Set net torque to zero when stopped by ground
                    isRunning = false; // Pause the simulation
                    const angleToGround =
                        Math.atan2(groundLevelY - (fixedPivotY + beamThickness / 2), halfBeamLength) * (180 / Math.PI);
                    if (abs_y_left_end_bottom > groundLevelY) {
                        newBeamAngle = Math.max(newBeamAngle, -angleToGround);
                    }
                    if (abs_y_right_end_bottom > groundLevelY) {
                        newBeamAngle = Math.min(newBeamAngle, angleToGround);
                    }
                }
                beamAngle = newBeamAngle;
                updateUI(); // Update UI after state changes
                if (isRunning) {
                    animationFrameId = requestAnimationFrame(simulate);
                } else {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            }
            // Event Handlers
            startButton.addEventListener("click", () => {
                if (!isRunning) {
                    isRunning = true;
                    lastTime = performance.now(); // Reset lastTime on start/resume
                    animationFrameId = requestAnimationFrame(simulate);
                    updateUI();
                }
            });
            pauseButton.addEventListener("click", () => {
                if (isRunning) {
                    isRunning = false;
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                    updateUI();
                }
            });
            resetButton.addEventListener("click", () => {
                isRunning = false;
                beamAngle = 0;
                angularVelocity = 0;
                lastTime = 0;
                totalTorque = 0;
                forces = JSON.parse(JSON.stringify(INITIAL_FORCES)); // Reset forces to initial state
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                updateUI();
            });
            // Initialize force controls
            const forceSliders = [];
            forces.forEach((f) => {
                const forceControlDiv = document.createElement("div");
                forceControlDiv.className = "grid gap-2 mb-4 border p-4 rounded-md bg-gray-50 dark:bg-gray-700";
                forceControlsContainer.appendChild(forceControlDiv);
                const h3 = document.createElement("h3");
                h3.className = "text-lg font-semibold";
                h3.textContent = \`Force \${f.id}\`;
                forceControlDiv.appendChild(h3);
                const magnitudeSlider = createSlider(
                    \`magnitude-\${f.id}\`,
                    \`Magnitude: \${f.magnitude.toFixed(1)} N\`,
                    0,
                    200,
                    1,
                    f.magnitude,
                    (value) => {
                        const index = forces.findIndex((force) => force.id === f.id);
                        if (index !== -1) {
                            forces[index].magnitude = value;
                            updateUI(); // Re-render to update force arrows and torque
                        }
                    },
                );
                forceControlDiv.appendChild(magnitudeSlider.element);
                const angleSlider = createSlider(\`angle-\${f.id}\`, \`Angle: \${f.angle.toFixed(0)}°\`, 0, 360, 1, f.angle, (value) => {
                    const index = forces.findIndex((force) => force.id === f.id);
                    if (index !== -1) {
                        forces[index].angle = value;
                        updateUI();
                    }
                });
                forceControlDiv.appendChild(angleSlider.element);
                const positionSlider = createSlider(
                    \`position-\${f.id}\`,
                    \`Position: \${(f.position / 100).toFixed(2)} m (from left end)\`,
                    0,
                    beamLength,
                    1,
                    f.position,
                    (value) => {
                        const index = forces.findIndex((force) => force.id === f.id);
                        if (index !== -1) {
                            forces[index].position = value;
                            updateUI();
                        }
                    },
                );
                forceControlDiv.appendChild(positionSlider.element);
                forceSliders.push({
                    id: f.id,
                    magnitudeSlider,
                    angleSlider,
                    positionSlider,
                });
            });
            // Initial UI render
            updateUI();
        });
    </script>
</body>
</html>`,
  spring: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spring-Mass System Simulation</title>
    <style>
        /* Basic Reset and Body Styles */
        body {
            margin: 0;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        /* Utility Classes (mimicking Tailwind) */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .gap-4 { gap: 1rem; } /* 16px */
        .gap-8 { gap: 2rem; } /* 32px */
        .w-full { width: 100%; }
        .max-w-none { max-width: none; }
        .min-h-screen { min-height: 100vh; }
        .p-4 { padding: 1rem; } /* 16px */
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
        .text-xs { font-size: 0.75rem; line-height: 1rem; } /* 12px */
        .text-\[10px\] { font-size: 10px; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .text-center { text-align: center; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .overflow-hidden { overflow: hidden; }
        .border-2 { border-width: 2px; }
        .rounded-lg { border-radius: 0.5rem; } /* 8px */
        .rounded-sm { border-radius: 0.125rem; } /* 2px */
        .rounded-full { border-radius: 9999px; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .h-1 { height: 0.25rem; } /* 4px */
        .h-2 { height: 0.5rem; } /* 8px */
        .h-5 { height: 1.25rem; } /* 20px */
        .h-6 { height: 1.5rem; } /* 24px */
        .w-5 { width: 1.25rem; } /* 20px */
        .w-6 { width: 1.5rem; } /* 24px */
        .w-0 { width: 0; }
        .z-5 { z-index: 5; }
        .z-7 { z-index: 7; }
        .z-8 { z-index: 8; }
        .z-10 { z-index: 10; }
        .z-12 { z-index: 12; }
        .z-14 { z-index: 14; }
        .z-15 { z-index: 15; }
        .z-20 { z-index: 20; }
        .-translate-x-1-2 { transform: translateX(-50%); }
        .white-space-nowrap { white-space: nowrap; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        .grid { display: grid; }
        /* Colors */
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-gray-50 { background-color: #f9fafb; }
        .bg-gray-600 { background-color: #4b5563; }
        .bg-gray-700 { background-color: #374151; }
        .bg-gray-800 { background-color: #1f2937; }
        .bg-gray-900 { background-color: #111827; }
        .bg-white { background-color: #ffffff; }
        .bg-blue-500 { background-color: #3b82f6; }
        .text-gray-900 { color: #111827; }
        .text-gray-800 { color: #1f2937; }
        .text-gray-700 { color: #374151; }
        .text-gray-600 { color: #4b5563; }
        .text-green-600 { color: #16a34a; }
        .text-purple-600 { color: #9333ea; }
        .text-orange-600 { color: #ea580c; }
        .border-gray-300 { border-color: #d1d5db; }
        .border-gray-500 { border-color: #6b7280; }
        .border-b-gray-500 { border-bottom-color: #6b7280; }
        /* Dark Mode Colors */
        @media (prefers-color-scheme: dark) {
            .dark\:bg-gray-900 { background-color: #111827; }
            .dark\:bg-gray-800 { background-color: #1f2937; }
            .dark\:bg-gray-700 { background-color: #374151; }
            .dark\:bg-gray-400 { background-color: #9ca3af; }
            .dark\:bg-gray-300 { background-color: #d1d5db; }
            .dark\:bg-blue-400 { background-color: #60a5fa; }
            .dark\:text-gray-100 { color: #f3f4f6; }
            .dark\:text-gray-200 { color: #e5e7eb; }
            .dark\:text-gray-300 { color: #d1d5db; }
            .dark\:text-gray-400 { color: #9ca3af; }
            .dark\:text-green-400 { color: #4ade80; }
            .dark\:text-purple-400 { color: #c084fc; }
            .dark\:text-orange-400 { color: #fb923c; }
            .dark\:border-gray-700 { border-color: #374151; }
            .dark\:border-b-gray-400 { border-bottom-color: #9ca3af; }
        }
        /* Shadcn/ui Button styles */
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            border-radius: 0.375rem; /* 6px */
            font-size: 0.875rem; /* 14px */
            font-weight: 500;
            height: 2.5rem; /* 40px */
            padding: 0 1rem; /* 16px */
            background-color: #000; /* Primary color */
            color: #fff; /* Text color */
            border: 1px solid transparent;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s;
        }
        .button:hover { background-color: #333; /* Darker on hover */ }
        .button:disabled { opacity: 0.5; cursor: not-allowed; }
        /* Shadcn/ui Card styles */
        .card {
            border-radius: 0.5rem; /* 8px */
            border: 1px solid #e5e7eb; /* border-gray-200 */
            background-color: #fff; /* bg-white */
            color: #020817; /* text-gray-950 */
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-sm */
        }
        .dark .card {
            border-color: #27272a; /* dark:border-gray-800 */
            background-color: #18181b; /* dark:bg-gray-950 */
            color: #fafafa; /* dark:text-gray-50 */
        }
        .card-header {
            display: flex;
            flex-direction: column;
            padding: 1.5rem; /* 24px */
        }
        .card-title {
            font-size: 1.5rem; /* 24px */
            font-weight: 600;
            line-height: 1.2;
            letter-spacing: -0.025em; /* tracking-tight */
        }
        .card-content {
            padding: 1.5rem; /* 24px */
            padding-top: 0;
        }
        /* Shadcn/ui Label styles */
        .label {
            font-size: 0.875rem; /* 14px */
            font-weight: 500;
            line-height: 1;
            color: #020817; /* text-gray-950 */
        }
        .dark .label { color: #fafafa; /* dark:text-gray-50 */ }
        /* Shadcn/ui Slider styles */
        .slider-container {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            height: 20px; /* Adjust height for better clickability */
            cursor: pointer;
            touch-action: none;
            user-select: none;
        }
        .slider-track {
            position: relative;
            background-color: #e2e8f0; /* bg-gray-200 */
            border-radius: 9999px;
            height: 8px; /* h-2 */
            width: 100%;
        }
        .dark .slider-track { background-color: #3f3f46; /* dark:bg-gray-700 */ }
        .slider-range {
            position: absolute;
            background-color: #000; /* bg-gray-900 */
            border-radius: 9999px;
            height: 100%;
        }
        .dark .slider-range { background-color: #fafafa; /* dark:bg-gray-50 */ }
        .slider-thumb {
            display: block;
            width: 20px; /* h-5 w-5 */
            height: 20px;
            background-color: #fff; /* bg-white */
            border: 2px solid #000; /* border-gray-900 */
            border-radius: 9999px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* shadow */
            transition: transform 0.2s;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: grab;
        }
        .dark .slider-thumb {
            background-color: #020817; /* dark:bg-gray-950 */
            border-color: #fafafa; /* dark:border-gray-50 */
        }
        .slider-thumb:focus-visible {
            outline: 2px solid #2563eb; /* ring-blue-600 */
            outline-offset: 2px;
        }
        .slider-thumb:active { cursor: grabbing; }
        /* Specific styles for the simulation elements */
        #simulationDisplay {
            max-width: 700px; /* simulationWidth */
            height: 400px; /* simulationHeight */
        }
        #ground {
            top: calc(400px - 50px); /* groundLevelY */
            left: 0;
            z-index: 7;
        }
        #mass {
            width: 40px;
            height: 40px;
            background-color: #3b82f6; /* blue-500 */
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(-50%, -50%);
        }
        #spring {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 5px;
            background-color: #4b5563; /* gray-600 */
        }
        /* Spring styles */
        .spring-line {
            position: absolute;
            background-color: #4b5563; /* gray-600 */
            height: 3px;
            top: 50%;
            transform: translateY(-50%);
        }
        /* Damping Box */
        #dampingBox {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body class="bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
        Spring-Mass System Simulation
    </h1>
    <div class="flex flex-col items-center gap-8 w-full max-w-none">
        <!-- Simulation Control Buttons -->
        <div class="flex justify-center gap-4 mt-4 mb-4">
            <button id="startButton" class="button">Start Simulation</button>
            <button id="pauseButton" class="button">Pause Simulation</button>
            <button id="resetButton" class="button">Reset All</button>
        </div>
        <!-- Simulation Display -->
        <div id="simulationDisplay" class="relative flex items-center justify-center overflow-hidden border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg w-full h-[400px]">
            <!-- Ground -->
            <div id="ground" class="absolute w-full h-2 bg-gray-600 dark:bg-gray-300" style="bottom: 0;"></div>
            <!-- Mass -->
            <div id="mass" class="absolute" style="left: 100px; bottom: 50px;"></div>
            <!-- Spring -->
            <div id="spring" class="absolute" style="height: 150px;">
                <!-- Spring lines will be dynamically added here by JS -->
            </div>
            <!-- Damping Box -->
            <div id="dampingBox" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Damping: <span id="dampingValue"></span>
            </div>
        </div>
        <div class="text-lg font-medium text-gray-800 dark:text-gray-200">
            Displacement: <span id="displacementDisplay" class="font-bold">0.00 m</span>
        </div>
        <!-- Simulation Controls -->
        <div class="card w-full lg:w-3/4 min-w-[280px]">
            <div class="card-header">
                <h2 class="card-title">Simulation Controls</h2>
            </div>
            <div id="springControlsContainer" class="card-content grid gap-4">
                <!-- Spring controls will be dynamically added here by JS -->
            </div>
        </div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Simulation parameters
            const simulationWidth = 700;
            const simulationHeight = 400;
            const groundHeight = 50;
            const massWidth = 40;
            const springBaseHeight = 150;
            const springWidth = 5;
            const springSegments = 20;
            const defaultSpringConstant = 1;
            const defaultMassValue = 1;
            const defaultDampingValue = 0.1;
            // State variables
            let springConstant = defaultSpringConstant;
            let massValue = defaultMassValue;
            let dampingValue = defaultDampingValue;
            let displacement = 0;
            let velocity = 0;
            let isRunning = false;
            let lastTime = 0;
            let animationFrameId = null;
            // DOM Elements
            const simulationDisplay = document.getElementById("simulationDisplay");
            const groundElement = document.getElementById("ground");
            const massElement = document.getElementById("mass");
            const springElement = document.getElementById("spring");
            const springControlsContainer = document.getElementById("springControlsContainer");
            const startButton = document.getElementById("startButton");
            const pauseButton = document.getElementById("pauseButton");
            const resetButton = document.getElementById("resetButton");
            const displacementDisplay = document.getElementById("displacementDisplay");
            const dampingValueDisplay = document.getElementById("dampingValue");
            // Set initial static element positions and sizes
            simulationDisplay.style.maxWidth = \`\${simulationWidth}px\`;
            groundElement.style.bottom = \`0px\`;
            massElement.style.width = \`\${massWidth}px\`;
            massElement.style.height = \`\${massWidth}px\`;
            springElement.style.width = \`\${springWidth}px\`;
            springElement.style.height = \`\${springBaseHeight}px\`;
            // Helper to create a slider
            function createSlider(id, labelText, min, max, step, initialValue, onChange) {
                const div = document.createElement("div");
                div.className = "grid gap-2 mb-4 border p-4 rounded-md bg-gray-50 dark:bg-gray-700";
                const h3 = document.createElement("h3");
                h3.className = "text-lg font-semibold";
                h3.textContent = labelText;
                // div.appendChild(h3); // Removed as labelText now includes the label for the slider itself
                const labelDiv = document.createElement("div");
                const label = document.createElement("label");
                label.htmlFor = id;
                label.className = "label";
                label.textContent = \`\${labelText.split(":")[0]}: \${initialValue.toFixed(1)}\`; // Initial text
                labelDiv.appendChild(label);
                div.appendChild(labelDiv);
                const sliderContainer = document.createElement("div");
                sliderContainer.className = "slider-container w-full";
                const sliderTrack = document.createElement("div");
                sliderTrack.className = "slider-track";
                sliderContainer.appendChild(sliderTrack);
                const sliderRange = document.createElement("div");
                sliderRange.className = "slider-range";
                sliderTrack.appendChild(sliderRange);
                const sliderThumb = document.createElement("div");
                sliderThumb.className = "slider-thumb";
                sliderThumb.setAttribute("role", "slider");
                sliderThumb.setAttribute("aria-valuemin", min);
                sliderThumb.setAttribute("aria-valuemax", max);
                sliderThumb.setAttribute("aria-valuenow", initialValue);
                sliderThumb.setAttribute("tabindex", "0");
                sliderTrack.appendChild(sliderThumb);
                div.appendChild(sliderContainer);
                let isDragging = false;
                const updateSlider = (value) => {
                    const percentage = ((value - min) / (max - min)) * 100;
                    sliderRange.style.width = \`\${percentage}%\`;
                    sliderThumb.style.left = \`calc(\${percentage}% - \${sliderThumb.offsetWidth / 2}px)\`;
                    label.textContent = \`\${labelText.split(":")[0]}: \${value.toFixed(1)}\`;
                    sliderThumb.setAttribute("aria-valuenow", value);
                };
                updateSlider(initialValue);
                const getSliderValue = (e) => {
                    const rect = sliderTrack.getBoundingClientRect();
                    let clientX = e.clientX;
                    if (e.touches && e.touches.length > 0) {
                        clientX = e.touches[0].clientX;
                    }
                    const clickX = clientX - rect.left;
                    let value = (clickX / rect.width) * (max - min) + min;
                    value = Math.round(value / step) * step;
                    return Math.max(min, Math.min(max, value));
                };
                const onPointerDown = (e) => {
                    isDragging = true;
                    sliderThumb.focus();
                    const value = getSliderValue(e);
                    updateSlider(value);
                    onChange(value);
                };
                const onPointerMove = (e) => {
                    if (!isDragging) return;
                    const value = getSliderValue(e);
                    updateSlider(value);
                    onChange(value);
                };
                const onPointerUp = () => {
                    isDragging = false;
                };
                sliderContainer.addEventListener("mousedown", onPointerDown);
                sliderContainer.addEventListener("touchstart", onPointerDown, { passive: true });
                document.addEventListener("mousemove", onPointerMove);
                document.addEventListener("touchmove", onPointerMove, { passive: true });
                document.addEventListener("mouseup", onPointerUp);
                document.addEventListener("touchend", onPointerUp);
                sliderThumb.addEventListener("keydown", (e) => {
                    let newValue = Number.parseFloat(sliderThumb.getAttribute("aria-valuenow"));
                    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                        newValue += step;
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                        newValue -= step;
                    } else {
                        return;
                    }
                    newValue = Math.max(min, Math.min(max, newValue));
                    updateSlider(newValue);
                    onChange(newValue);
                    e.preventDefault();
                });
                return { element: div, update: updateSlider };
            }
            // Function to render the spring
            function renderSpring(height) {
                springElement.innerHTML = "";
                const segmentHeight = height / springSegments;
                for (let i = 0; i < springSegments; i++) {
                    const line = document.createElement("div");
                    line.className = "spring-line";
                    line.style.height = \`3px\`;
                    line.style.width = \`\${springWidth}px\`;
                    line.style.left = \`0\`;
                    line.style.top = \`\${i * segmentHeight}px\`;
                    springElement.appendChild(line);
                }
            }
            // Function to update the UI based on current state
            function updateUI() {
                // Update mass position
                massElement.style.bottom = \`\${groundHeight + springBaseHeight + displacement}px\`;
                // Update spring height
                springElement.style.height = \`\${springBaseHeight + displacement}px\`;
                // Render spring
                renderSpring(springBaseHeight + displacement);
                // Update displacement display
                displacementDisplay.textContent = \`\${(displacement / 100).toFixed(2)} m\`;
                // Update damping value display
                dampingValueDisplay.textContent = dampingValue.toFixed(2);
                // Update button states
                startButton.disabled = isRunning;
                pauseButton.disabled = !isRunning;
            }
            // Simulation loop
            function simulate(time) {
                if (!lastTime) {
                    lastTime = time;
                }
                const deltaTime = (time - lastTime) / 1000; // Seconds
                lastTime = time;
                // Calculate force
                const force = -springConstant * displacement - dampingValue * velocity;
                // Calculate acceleration
                const acceleration = force / massValue;
                // Update velocity
                velocity += acceleration * deltaTime;
                // Update displacement
                displacement += velocity * deltaTime;
                updateUI(); // Update UI after state changes
                if (isRunning) {
                    animationFrameId = requestAnimationFrame(simulate);
                } else {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            }
            // Event Handlers
            startButton.addEventListener("click", () => {
                if (!isRunning) {
                    isRunning = true;
                    lastTime = performance.now(); // Reset lastTime on start/resume
                    animationFrameId = requestAnimationFrame(simulate);
                    updateUI();
                }
            });
            pauseButton.addEventListener("click", () => {
                if (isRunning) {
                    isRunning = false;
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                    updateUI();
                }
            });
            resetButton.addEventListener("click", () => {
                isRunning = false;
                displacement = 0;
                velocity = 0;
                lastTime = 0;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                updateUI();
            });
            // Initialize spring controls
            const springConstantSlider = createSlider(
                "springConstant",
                "Spring Constant: 1 N/m",
                0.1,
                5,
                0.1,
                springConstant,
                (value) => {
                    springConstant = value;
                    updateUI(); // Re-render to update force arrows and torque
                },
            );
            springControlsContainer.appendChild(springConstantSlider.element);
            const massSlider = createSlider("mass", "Mass: 1 kg", 0.1, 5, 0.1, massValue, (value) => {
                massValue = value;
                updateUI();
            });
            springControlsContainer.appendChild(massSlider.element);
            const dampingSlider = createSlider("damping", "Damping: 0.1", 0, 1, 0.01, dampingValue, (value) => {
                dampingValue = value;
                updateUI();
            });
            springControlsContainer.appendChild(dampingSlider.element);
            // Initial UI render
            updateUI();
        });
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
    return HTML_CODE_REFERENCES.pendulum
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
    return HTML_CODE_REFERENCES.projectile
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
    return HTML_CODE_REFERENCES.moments
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
    return HTML_CODE_REFERENCES["light-reflection"]
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
      return HTML_CODE_REFERENCES["double-slit"]
    }
    return HTML_CODE_REFERENCES["wave-interference"]
  }

  // Default to pendulum for general physics requests
  return HTML_CODE_REFERENCES.pendulum
}

export async function POST(req: NextRequest) {
  try {
    const { user_input, language = "en" } = await req.json()

    if (!user_input) {
      return NextResponse.json({ error: "Missing user_input" }, { status: 400 })
    }

    // Select appropriate reference code
    const referenceCode = selectReference(user_input)
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

${
  language === "id"
    ? `
LANGUAGE REQUIREMENTS:
- All text, labels, and descriptions must be in Bahasa Indonesia
- Physics terms should use Indonesian scientific terminology
- Keep physics equations in standard mathematical notation
- Ensure all UI elements are properly translated
`
    : ""
}

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

function extractPhysicsConcepts(input: string): string[] {
  const concepts: string[] = []
  const lowerInput = input.toLowerCase()
  
  // Physics concept mapping
  const conceptMap = {
    'energy': ['Energy Conservation', 'Kinetic Energy', 'Potential Energy'],
    'force': ['Force', 'Newton\'s Laws', 'Acceleration'],
    'motion': ['Kinematics', 'Velocity', \'Acceleration
