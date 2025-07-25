"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Target, Play, ArrowRight, CheckCircle, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function LandingPageContent() {
  const { t } = useI18n()
  const { language } = useI18n()

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: t("features.aiEngine.title"),
      description: t("features.aiEngine.description"),
    },
    {
      icon: <Play className="h-8 w-8" />,
      title: t("features.smartControls.title"),
      description: t("features.smartControls.description"),
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t("features.realTimeViz.title"),
      description: t("features.realTimeViz.description"),
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: t("features.advancedConcepts.title"),
      description: t("features.advancedConcepts.description"),
    },
  ]

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

  const simulations = [
    {
      name: t("examples.interactivePendulum.title"),
      icon: "🎯",
      concepts: getSimulationConcepts("interactivePendulum"),
    },
    {
      name: t("examples.smartProjectile.title"),
      icon: "🚀",
      concepts: getSimulationConcepts("smartProjectile"),
    },
    {
      name: t("examples.advancedSpring.title"),
      icon: "🌊",
      concepts: getSimulationConcepts("advancedSpring"),
    },
    {
      name: t("examples.collisionEngine.title"),
      icon: "💥",
      concepts: getSimulationConcepts("collisionEngine"),
    },
    {
      name: t("examples.orbitalMechanics.title"),
      icon: "🪐",
      concepts: getSimulationConcepts("orbitalMechanics"),
    },
    {
      name: t("examples.wavePhysics.title"),
      icon: "〰️",
      concepts: getSimulationConcepts("wavePhysics"),
    },
  ]

  const benefits = [
    t("benefits.0"),
    t("benefits.1"),
    t("benefits.2"),
    t("benefits.3"),
    t("benefits.4"),
    t("benefits.5"),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#7962A6] to-[#A796CB] bg-clip-text text-transparent">
                {t("landing.title")}
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-[#7962A6] transition-colors">
                {t("nav.features")}
              </Link>
              <Link href="#simulations" className="text-gray-600 hover:text-[#7962A6] transition-colors">
                {t("nav.simulations")}
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-[#7962A6] transition-colors">
                {t("nav.about")}
              </Link>
              <LanguageSwitcher />
              <Link href="/login">
                <Button className="bg-gradient-to-r from-[#7962A6] to-[#A796CB] hover:from-[#6B5595] hover:to-[#9B89BA]">
                  {t("nav.getStarted")}
                </Button>
              </Link>
            </nav>
            <div className="md:hidden">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-[#7962A6] to-[#A796CB] bg-clip-text text-transparent mb-6">
              {t("landing.title")}
            </h1>
            <p className="text-2xl text-gray-600 mb-4">{t("landing.subtitle")}</p>
            <p className="text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed mb-12">{t("landing.description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-[#7962A6] to-[#A796CB] hover:from-[#6B5595] hover:to-[#9B89BA] shadow-lg"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  {t("landing.startCreating")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-2 border-[#A796CB] hover:border-[#7962A6] bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                {t("landing.watchDemo")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">{t("landing.powerfulFeatures")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("landing.featuresDescription")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-[#A796CB]/20 to-[#7962A6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#7962A6]">
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
            <h2 className="text-5xl font-bold text-gray-800 mb-6">{t("landing.advancedSimulations")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("landing.simulationsDescription")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simulations.map((sim, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#A796CB]/20 to-[#7962A6]/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {sim.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{sim.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        {sim.concepts.map((concept: string, idx: number) => (
                          <Badge key={idx} className="text-xs bg-[#A796CB]/10 border-[#A796CB]/30 text-[#7962A6]">
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
                className="text-lg px-8 py-4 bg-gradient-to-r from-[#7962A6] to-[#A796CB] hover:from-[#6B5595] hover:to-[#9B89BA]"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t("landing.createSimulation")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#A796CB]/10 to-[#7962A6]/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-800 mb-8">{t("landing.whyChoose")}</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
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
                  src="/images/simulation-sample.png"
                  alt="ViSim Physics Simulation Interface showing interactive pendulum with real-time controls"
                  width={800}
                  height={600}
                  className="w-full rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#7962A6] to-[#A796CB] text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-6">{t("landing.readyToCreate")}</h2>
          <p className="text-xl mb-12 opacity-90">{t("landing.joinThousands")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-[#7962A6] hover:bg-gray-100">
                <Brain className="mr-2 h-5 w-5" />
                {t("landing.getStartedFree")}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#7962A6] bg-transparent"
            >
              <Users className="mr-2 h-5 w-5" />
              {t("landing.learnMore")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
