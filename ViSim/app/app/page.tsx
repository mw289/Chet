"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, Target, LogOut, Library } from "lucide-react"
import { SimulationDisplay } from "@/components/simulation-display"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { useProfile } from "@/lib/hooks/use-profile"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function SimulationGenerator() {
  const [userInput, setUserInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { t, language } = useI18n()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  // Show loading while checking auth
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#A796CB]/10 via-blue-50 to-[#7962A6]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#7962A6] to-[#A796CB] rounded-3xl flex items-center justify-center text-2xl mb-4 animate-pulse">
            ViSim
          </div>
          <p className="text-gray-600">{t("app.loadingWorkspace")}</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  const generateSimulation = async () => {
    if (!userInput.trim()) return

    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/orchestrator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_input: userInput,
          language: language, // Pass the current language to the API
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Network error" }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
    } catch (err: any) {
      console.error("Generation error:", err)
      setError(err.message || "Failed to generate simulation. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getSimulationConcepts = (key: string) => {
    const conceptsMap: Record<string, Record<string, string[]>> = {
      interactivePendulum: {
        en: ["Energy Conservation", "Angular Motion", "Damping"],
        id: ["Konservasi Energi", "Gerak Sudut", "Redaman"],
      },
      smartProjectile: {
        en: ["Vector Physics", "Air Resistance", "Kinematics"],
        id: ["Fisika Vektor", "Hambatan Udara", "Kinematika"],
      },
      advancedSpring: {
        en: ["Hooke's Law", "Oscillation", "Energy Transfer"],
        id: ["Hukum Hooke", "Osilasi", "Transfer Energi"],
      },
      collisionEngine: {
        en: ["Momentum", "Energy", "Conservation Laws"],
        id: ["Momentum", "Energi", "Hukum Konservasi"],
      },
      orbitalMechanics: {
        en: ["Gravity", "Orbital Motion", "Kepler's Laws"],
        id: ["Gravitasi", "Gerak Orbital", "Hukum Kepler"],
      },
      wavePhysics: {
        en: ["Wave Equation", "Interference", "Frequency"],
        id: ["Persamaan Gelombang", "Interferensi", "Frekuensi"],
      },
    }
    return conceptsMap[key]?.[language] || conceptsMap[key]?.en || []
  }

  const examplePrompts = [
    {
      title: t("examples.interactivePendulum.title"),
      description: t("examples.interactivePendulum.description"),
      prompt: t("examples.interactivePendulum.prompt"),
      icon: "🎯",
      concepts: getSimulationConcepts("interactivePendulum"),
    },
    {
      title: t("examples.smartProjectile.title"),
      description: t("examples.smartProjectile.description"),
      prompt: t("examples.smartProjectile.prompt"),
      icon: "🚀",
      concepts: getSimulationConcepts("smartProjectile"),
    },
    {
      title: t("examples.advancedSpring.title"),
      description: t("examples.advancedSpring.description"),
      prompt: t("examples.advancedSpring.prompt"),
      icon: "🌊",
      concepts: getSimulationConcepts("advancedSpring"),
    },
    {
      title: t("examples.collisionEngine.title"),
      description: t("examples.collisionEngine.description"),
      prompt: t("examples.collisionEngine.prompt"),
      icon: "💥",
      concepts: getSimulationConcepts("collisionEngine"),
    },
    {
      title: t("examples.orbitalMechanics.title"),
      description: t("examples.orbitalMechanics.description"),
      prompt: t("examples.orbitalMechanics.prompt"),
      icon: "🪐",
      concepts: getSimulationConcepts("orbitalMechanics"),
    },
    {
      title: t("examples.wavePhysics.title"),
      description: t("examples.wavePhysics.description"),
      prompt: t("examples.wavePhysics.prompt"),
      icon: "〰️",
      concepts: getSimulationConcepts("wavePhysics"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A796CB]/10 via-blue-50 to-[#7962A6]/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#7962A6] to-[#A796CB] bg-clip-text text-transparent">
                {t("app.title")}
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/library">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A796CB]/30 hover:bg-[#A796CB]/10 bg-transparent"
                >
                  <Library className="h-4 w-4 mr-2" />
                  {t("nav.library")}
                </Button>
              </Link>
              <LanguageSwitcher />
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("nav.signOut")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#7962A6] to-[#A796CB] bg-clip-text text-transparent">
                {t("app.title")}
              </h1>
              <p className="text-gray-500 text-xl mt-2">{t("app.subtitle")}</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">{t("app.description")}</p>
        </div>

        {/* Main Content - Changes layout when simulation is generated */}
        {result ? (
          // Full-width layout when simulation is generated
          <div className="space-y-8">
            {/* Success Status */}
            <Card className="shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  ✅ {t("app.simulationGenerated")}
                  {result.language === "id" && (
                    <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">🇮🇩 Bahasa Indonesia</Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-green-600">{t("app.advancedPhysicsEngine")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {result.pipeline_steps?.slice(0, 4).map((step: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-green-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="truncate">{step.replace("✅ ", "")}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Simulation Display */}
            <SimulationDisplay
              simulationHtml={result.simulation_html}
              structuredData={result.structured_data}
              features={result.features}
            />

            {/* Generate Another Button */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setResult(null)
                  setUserInput("")
                  setError(null)
                }}
                variant="outline"
                className="border-[#A796CB]/30 hover:bg-[#A796CB]/10"
              >
                <Brain className="h-4 w-4 mr-2" />
                {t("app.generateAnother")}
              </Button>
            </div>
          </div>
        ) : (
          // Two-column layout when no simulation is generated
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#7962A6] to-[#A796CB] text-white">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Brain className="h-6 w-6" />
                    {t("app.describeSimulation")}
                    {language === "id" && (
                      <Badge className="ml-2 bg-white/20 text-white border-white/30">🇮🇩 Bahasa Indonesia</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-purple-100">{t("app.requestDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <Textarea
                    placeholder={t("app.examplePlaceholder")}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={5}
                    className="resize-none text-base border-2 focus:border-[#A796CB] rounded-lg"
                  />

                  <Button
                    onClick={generateSimulation}
                    disabled={!userInput.trim() || isGenerating}
                    className="w-full h-14 text-lg bg-gradient-to-r from-[#7962A6] to-[#A796CB] hover:from-[#6B5595] hover:to-[#9B89BA] rounded-lg shadow-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        {t("app.creatingSimulation")}
                      </>
                    ) : (
                      <>
                        <Brain className="mr-3 h-6 w-6" />
                        {t("app.generateSimulation")}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generation Status */}
              {isGenerating && (
                <Card className="shadow-lg border-[#A796CB]/30 bg-gradient-to-r from-[#A796CB]/10 to-[#7962A6]/10">
                  <CardHeader>
                    <CardTitle className="text-[#7962A6] flex items-center gap-2">
                      <Brain className="h-5 w-5 animate-pulse" />
                      {t("app.aiPhysicsWorking")}
                      {language === "id" && (
                        <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">🇮🇩 Bahasa Indonesia</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#7962A6] rounded-full animate-bounce"></div>
                        <span className="text-[#7962A6]">{t("app.analyzingConcepts")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 bg-[#A796CB] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <span className="text-[#7962A6]">{t("app.creatingEngine")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 bg-[#7962A6] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <span className="text-[#7962A6]">{t("app.addingControls")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 bg-[#A796CB] rounded-full animate-bounce"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                        <span className="text-[#7962A6]">{t("app.implementingFeatures")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Examples and Error Section */}
            <div className="space-y-6">
              {/* Error Display */}
              {error && (
                <Card className="border-red-200 bg-red-50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">⚠️ {t("app.generationError")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="text-sm text-red-500 mb-4">
                      <p>
                        <strong>{t("app.possibleCauses")}</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {t("app.errorCauses").map((cause: string, index: number) => (
                          <li key={index}>{cause}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setError(null)}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {t("app.dismiss")}
                      </Button>
                      <Button
                        onClick={generateSimulation}
                        disabled={!userInput.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t("app.tryAgain")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Smart Examples */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t("app.simulationExamples")}
                  </CardTitle>
                  <CardDescription>{t("app.advancedSimulationsDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {examplePrompts.map((example, index) => (
                      <div
                        key={index}
                        onClick={() => setUserInput(example.prompt)}
                        className="p-4 bg-gradient-to-r from-gray-50 to-[#A796CB]/10 hover:from-[#A796CB]/10 hover:to-[#7962A6]/10 rounded-lg border border-gray-200 hover:border-[#A796CB]/30 cursor-pointer transition-all duration-200 hover:shadow-md group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#A796CB]/20 to-[#7962A6]/20 rounded-lg flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-110 transition-transform">
                            {example.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{example.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {example.concepts.map((concept: string, idx: number) => (
                                <Badge key={idx} className="text-xs bg-[#A796CB]/10 border-[#A796CB]/30 text-[#7962A6]">
                                  {concept}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-[#7962A6] italic line-clamp-2">{example.prompt}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
