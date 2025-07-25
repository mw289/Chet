"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Download, RefreshCw, AlertCircle } from "lucide-react"

interface SimulationViewerProps {
  simulationHtml: string
  title?: string
}

export function SimulationViewer({ simulationHtml, title = "Physics Simulation" }: SimulationViewerProps) {
  const [iframeError, setIframeError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const openInNewTab = () => {
    try {
      const blob = new Blob([simulationHtml], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const newWindow = window.open(url, "_blank")

      if (!newWindow) {
        alert("Please allow popups for this site to open the simulation in a new tab.")
      }

      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } catch (error) {
      console.error("Error opening simulation:", error)
      alert("Failed to open simulation. Please try downloading it instead.")
    }
  }

  const downloadSimulation = () => {
    try {
      const blob = new Blob([simulationHtml], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading simulation:", error)
      alert("Failed to download simulation. Please try copying the code manually.")
    }
  }

  const refreshIframe = () => {
    setIsRefreshing(true)
    setIframeError(false)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleIframeError = () => {
    setIframeError(true)
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white">
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-2">
            <Button onClick={refreshIframe} size="sm" variant="secondary" disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={openInNewTab} size="sm" variant="secondary">
              <ExternalLink className="h-4 w-4 mr-1" />
              Open
            </Button>
            <Button onClick={downloadSimulation} size="sm" variant="secondary">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {iframeError ? (
          <div className="h-96 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
            <div className="text-center p-6">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview Not Available</h3>
              <p className="text-gray-500 mb-4">The simulation preview couldn't load in this embedded view.</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={openInNewTab} className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <Button onClick={downloadSimulation} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            key={isRefreshing ? Date.now() : "iframe"}
            srcDoc={simulationHtml}
            className="w-full h-96 border-0"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-forms"
            onError={handleIframeError}
            onLoad={() => setIframeError(false)}
          />
        )}

        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>💡 For best experience, open in a new tab or download the HTML file</span>
            <div className="flex gap-2">
              <Button onClick={openInNewTab} size="sm" variant="outline">
                <ExternalLink className="h-4 w-4 mr-1" />
                New Tab
              </Button>
              <Button onClick={downloadSimulation} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
