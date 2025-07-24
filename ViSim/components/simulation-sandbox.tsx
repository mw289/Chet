"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Settings, ExternalLink, Download, Eye } from "lucide-react"
import { useState } from "react"

interface SimulationSandboxProps {
  simulationHtml: string
  structuredData?: any
  features?: string[]
}

export function SimulationSandbox({ simulationHtml, structuredData, features }: SimulationSandboxProps) {
  const [showPreview, setShowPreview] = useState(false)

  const openInNewTab = () => {
    const blob = new Blob([simulationHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const downloadSimulation = () => {
    const blob = new Blob([simulationHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `physics-simulation-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

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
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={openInNewTab}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              onClick={downloadSimulation}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download HTML
            </Button>
            <Button
              onClick={togglePreview}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50 bg-transparent"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="bg-gray-50 p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Simulation Preview</h4>
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <iframe
                srcDoc={simulationHtml}
                className="w-full h-96 border-0"
                title="Physics Simulation Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              ⚠️ If the preview doesn't work properly, use "Open in New Tab" for the full experience.
            </p>
          </div>
        )}

        {/* Code Preview */}
        <div className="bg-gray-50 p-4 border-t">
          <details className="group">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-purple-600 transition-colors">
              📄 View HTML Source Code
            </summary>
            <div className="mt-3 bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{simulationHtml.substring(0, 500)}...</code>
              </pre>
              <p className="text-gray-400 text-xs mt-2">Full code available when you download or open in new tab</p>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  )
}
