"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Settings } from "lucide-react"

interface SimulationSandboxProps {
  simulationHtml: string
  structuredData?: any
  features?: string[]
}

export function SimulationSandbox({ simulationHtml, structuredData, features }: SimulationSandboxProps) {
  return (
    <Card className="shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white">
        <CardTitle className="text-2xl flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">🧠</div>
          Intelligent Physics Simulation
        </CardTitle>
        <CardDescription className="text-purple-100 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            Interactive Controls
          </span>
          <span className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Real-time Physics
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white border-b p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {structuredData?.key_concepts?.map((concept: string, index: number) => (
              <Badge key={index} className="bg-purple-50 border-purple-200 text-purple-700">
                {concept}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Physics Engine Active
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Real-time Calculations
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Smart Controls Enabled
            </div>
          </div>
        </div>
        <div className="min-h-[600px] bg-gray-50" dangerouslySetInnerHTML={{ __html: simulationHtml }} />
      </CardContent>
    </Card>
  )
}
