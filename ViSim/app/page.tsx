import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Target, Play, ArrowRight, CheckCircle, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Physics Engine",
      description:
        "Advanced AI generates accurate physics simulations with real-time calculations and proper equations.",
    },
    {
      icon: <Play className="h-8 w-8" />,
      title: "Smart Controls",
      description: "Pause/play functionality, adjustable parameters, and interactive controls for deep exploration.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-Time Visualization",
      description: "Live data display, vector visualization, and energy conservation tracking in real-time.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Advanced Physics Concepts",
      description: "From pendulums to orbital mechanics, covering complex physics with accurate mathematical models.",
    },
  ]

  const simulations = [
    { name: "Intelligent Pendulum", icon: "🎯", concepts: ["Energy Conservation", "Angular Motion"] },
    { name: "Smart Projectile Motion", icon: "🚀", concepts: ["Vector Physics", "Air Resistance"] },
    { name: "Advanced Spring System", icon: "🌊", concepts: ["Hooke's Law", "Oscillation"] },
    { name: "Collision Physics Engine", icon: "💥", concepts: ["Momentum", "Conservation Laws"] },
    { name: "Orbital Mechanics", icon: "🪐", concepts: ["Gravity", "Kepler's Laws"] },
    { name: "Wave Physics", icon: "〰️", concepts: ["Wave Equation", "Interference"] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-xl">
                🧠
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Intelligent Physics
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
                Features
              </Link>
              <Link href="#simulations" className="text-gray-600 hover:text-purple-600 transition-colors">
                Simulations
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-purple-600 transition-colors">
                About
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
                🧠
              </div>
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Intelligent Physics
            </h1>
            <p className="text-2xl text-gray-600 mb-4">AI-Powered Smart Simulations</p>
            <p className="text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed mb-12">
              Generate intelligent physics simulations with accurate calculations, pause/play controls, real-time data
              visualization, and advanced physics engines powered by AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 shadow-lg"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Start Creating Simulations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-2 border-purple-200 hover:border-purple-300 bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 rounded-3xl p-8 shadow-2xl">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Intelligent Physics Simulation Dashboard"
                width={800}
                height={400}
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Powerful AI Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced physics simulations with intelligent controls and real-time calculations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Simulations Section */}
      <section id="simulations" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Advanced Physics Simulations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic mechanics to complex orbital dynamics, create any physics simulation with AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simulations.map((sim, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {sim.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{sim.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        {sim.concepts.map((concept, idx) => (
                          <Badge key={idx} className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/login">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Simulation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-800 mb-8">Why Choose Intelligent Physics?</h2>
              <div className="space-y-6">
                {[
                  "AI-powered physics engine with accurate calculations",
                  "Real-time data visualization and vector display",
                  "Pause/play controls for detailed analysis",
                  "Advanced physics concepts made interactive",
                  "Energy conservation and momentum tracking",
                  "Customizable parameters and smart controls",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Physics Simulation Interface"
                  width={500}
                  height={400}
                  className="w-full rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Create Intelligent Simulations?</h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands of educators, students, and researchers using AI-powered physics simulations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100">
                <Brain className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            >
              <Users className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-lg">
                  🧠
                </div>
                <span className="text-xl font-bold">Intelligent Physics</span>
              </div>
              <p className="text-gray-400">AI-powered physics simulations for education and research.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Simulations</div>
                <div>Pricing</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-gray-400">
                <div>Documentation</div>
                <div>Tutorials</div>
                <div>Support</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Contact</div>
                <div>Privacy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Intelligent Physics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
