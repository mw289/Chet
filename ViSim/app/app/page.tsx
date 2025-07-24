"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, Zap, Target, BookOpen, Play, LogOut, User } from "lucide-react"
import { SimulationSandbox } from "@/components/simulation-sandbox"
import Link from "next/link"

export default function SimulationGenerator() {
  const [userInput, setUserInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generateSimulation = async () => {
    if (!userInput.trim()) return

    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userInput }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Generation failed")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const examplePrompts = [
    {
      title: "Intelligent Pendulum",
      description: "Advanced pendulum with energy conservation and damping",
      prompt:
        "Create an intelligent pendulum simulation with adjustable length, gravity, and damping. Show energy conservation, angular velocity, and proper physics equations.",
      icon: "🎯",
      concepts: ["Energy Conservation", "Angular Motion", "Damping"],
    },
    {
      title: "Smart Projectile Motion",
      description: "Projectile with air resistance and vector visualization",
      prompt:
        "Build a smart projectile motion simulator with air resistance, adjustable launch angle and velocity, showing trajectory path and vector components.",
      icon: "🚀",
      concepts: ["Vector Physics", "Air Resistance", "Kinematics"],
    },
    {
      title: "Advanced Spring System",
      description: "Spring-mass with realistic physics and energy display",
      prompt:
        "Create an advanced spring-mass system with Hooke's law, adjustable spring constant, mass, and damping. Show energy transformations and oscillation analysis.",
      icon: "🌊",
      concepts: ["Hooke's Law", "Oscillation", "Energy Transfer"],
    },
    {
      title: "Collision Physics Engine",
      description: "Elastic and inelastic collisions with momentum conservation",
      prompt:
        "Design a collision physics engine with two balls of adjustable mass and velocity. Show momentum and energy conservation in elastic and inelastic collisions.",
      icon: "💥",
      concepts: ["Momentum", "Energy", "Conservation Laws"],
    },
    {
      title: "Orbital Mechanics",
      description: "Planetary orbits with gravitational physics",
      prompt:
        "Create an orbital mechanics simulation with adjustable planet mass, orbital velocity, and distance. Show gravitational forces and Kepler's laws.",
      icon: "🪐",
      concepts: ["Gravity", "Orbital Motion", "Kepler's Laws"],
    },
    {
      title: "Wave Physics",
      description: "Wave interference and propagation",
      prompt:
        "Build a wave physics simulator with adjustable frequency, amplitude, and wavelength. Show wave interference patterns and wave equation.",
      icon: "〰️",
      concepts: ["Wave Equation", "Interference", "Frequency"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-xl">
                🧠
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Intelligent Physics
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Welcome back!</span>
              </div>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center text-3xl shadow-lg">
              🧠
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Intelligent Physics
              </h1>
              <p className="text-gray-500 text-xl mt-2">AI-Powered Smart Simulations</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Generate intelligent physics simulations with accurate calculations, pause/play controls, real-time data
            visualization, and advanced physics engines
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Brain className="h-6 w-6" />
                  Describe Your Intelligent Physics Simulation
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Request advanced physics simulations with accurate calculations and smart controls
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Textarea
                  placeholder="Example: Create an intelligent pendulum simulation with energy conservation, adjustable damping, and real-time physics data display..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={5}
                  className="resize-none text-base border-2 focus:border-purple-300 rounded-lg"
                />

                <Button
                  onClick={generateSimulation}
                  disabled={!userInput.trim() || isGenerating}
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 rounded-lg shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Creating Intelligent Simulation...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-3 h-6 w-6" />
                      Generate Smart Physics Simulation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Smart Examples */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Intelligent Physics Examples
                </CardTitle>
                <CardDescription>Advanced simulations with smart physics engines</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {examplePrompts.map((example, index) => (
                    <div
                      key={index}
                      onClick={() => setUserInput(example.prompt)}
                      className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 hover:from-purple-50 hover:to-blue-50 rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-all duration-200 hover:shadow-md group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-110 transition-transform">
                          {example.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{example.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {example.concepts.map((concept, idx) => (
                              <Badge key={idx} className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-blue-600 italic line-clamp-2">{example.prompt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generation Status */}
            {isGenerating && (
              <Card className="shadow-lg border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center gap-2">
                    <Brain className="h-5 w-5 animate-pulse" />
                    AI Physics Engine Working...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                      <span className="text-purple-700">Analyzing physics concepts and equations...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <span className="text-purple-700">Creating intelligent physics engine...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="text-purple-700">Adding smart controls and real-time data...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                      <span className="text-purple-700">Implementing pause/play and vector visualization...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {error && (
              <Card className="border-red-200 bg-red-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-600">⚠️ Generation Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => setError(null)} className="border-red-300">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {result && (
              <>
                {/* Success Status */}
                <Card className="shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      ✅ Intelligent Physics Simulation Generated!
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Advanced physics engine with smart controls and real-time calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.pipeline_steps?.map((step: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Simulation Info */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50">
                    <CardTitle className="text-gray-800 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {result.structured_data?.topic}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        Pause/Play Controls
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        Real-time Physics
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Advanced Physics Concepts</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.structured_data?.key_concepts?.map((concept: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700"
                            >
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Smart Features</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {result.features?.slice(0, 4).map((feature: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {feature.replace("✅ ", "")}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Intelligent Simulation Display */}
        {result?.simulation_html && (
          <div className="mt-12">
            <SimulationSandbox
              simulationHtml={result.simulation_html}
              structuredData={result.structured_data}
              features={result.features}
            />
          </div>
        )}
      </div>
    </div>
  )
}
