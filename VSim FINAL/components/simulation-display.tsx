"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExternalLink, Download, Eye, EyeOff, AlertCircle, Save, Loader2 } from "lucide-react"
import { useState } from "react"
import { useSimulations } from "@/lib/hooks/use-simulations"
import { useI18n } from "@/lib/i18n/context"

interface SimulationDisplayProps {
  simulationHtml: string
  structuredData?: any
  features?: string[]
}

export function SimulationDisplay({ simulationHtml, structuredData, features }: SimulationDisplayProps) {
  const [showPreview, setShowPreview] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveTitle, setSaveTitle] = useState(structuredData?.topic || "Visual Simulation")
  const [saveDescription, setSaveDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { saveSimulation } = useSimulations()
  const { t } = useI18n()

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
      a.download = `${(structuredData?.topic || "visual-simulation").toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading simulation:", error)
      alert("Failed to download simulation. Please try copying the code manually.")
    }
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
    setIframeError(false)
  }

  const handleIframeError = () => {
    setIframeError(true)
  }

  const handleSaveSimulation = async () => {
    if (!saveTitle.trim()) {
      setSaveError("Please enter a title for your simulation")
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const result = await saveSimulation({
        title: saveTitle.trim(),
        description: saveDescription.trim() || undefined,
        html_content: simulationHtml,
        physics_concepts: structuredData?.key_concepts || [],
        features: features || [],
      })

      if (result.error) {
        setSaveError(result.error)
      } else {
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveDialogOpen(false)
          setSaveSuccess(false)
          setSaveTitle(structuredData?.topic || "Visual Simulation")
          setSaveDescription("")
        }, 1500)
      }
    } catch (error: any) {
      setSaveError(error.message || "Failed to save simulation")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="shadow-2xl border-0 overflow-hidden">
      {/* Header with Title and Save Button */}
      <CardHeader className="bg-gradient-to-r from-[#7962A6] to-[#A796CB] text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-3">
            {structuredData?.topic || t("simulation.intelligentSimulation")}
          </CardTitle>

          {/* Save to Library Button */}
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Save className="h-4 w-4 mr-2" />
                {t("simulation.saveToLibrary")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("simulation.saveSimulationTitle")}</DialogTitle>
                <DialogDescription>{t("simulation.saveDescription")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="save-title" className="text-sm font-medium text-gray-700 block mb-2">
                    {t("simulation.titleRequired")}
                  </label>
                  <Input
                    id="save-title"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder={t("simulation.enterTitle")}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="save-description" className="text-sm font-medium text-gray-700 block mb-2">
                    {t("simulation.descriptionOptional")}
                  </label>
                  <Textarea
                    id="save-description"
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    placeholder={t("simulation.addDescription")}
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>

                {saveError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{saveError}</div>
                )}

                {saveSuccess && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200 flex items-center gap-2">
                    ✅ {t("simulation.simulationSaved")}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveSimulation}
                    disabled={isSaving || saveSuccess}
                    className="flex-1 bg-gradient-to-r from-[#7962A6] to-[#A796CB] hover:from-[#6B5595] hover:to-[#9B89BA]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t("simulation.saving")}
                      </>
                    ) : saveSuccess ? (
                      t("simulation.saved")
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t("simulation.saveSimulation")}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)} disabled={isSaving}>
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Preview Section */}
        {showPreview && (
          <div className="bg-gray-50">
            {iframeError ? (
              <div className="h-96 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                <div className="text-center p-6">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("simulation.previewNotAvailable")}</h3>
                  <p className="text-gray-500 mb-4">{t("simulation.previewError")}</p>
                  <Button onClick={openInNewTab} className="bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("simulation.openInNewTab")}
                  </Button>
                </div>
              </div>
            ) : (
              <iframe
                srcDoc={simulationHtml}
                className="w-full h-96 border-0"
                title={structuredData?.topic || t("simulation.intelligentSimulation")}
                sandbox="allow-scripts allow-same-origin allow-forms"
                onError={handleIframeError}
                onLoad={() => setIframeError(false)}
              />
            )}
          </div>
        )}

        {/* Controls and Info Section */}
        <div className="p-6 space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={openInNewTab}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t("simulation.openInNewTab")}
            </Button>
            <Button
              onClick={downloadSimulation}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {t("simulation.downloadHTML")}
            </Button>
            <Button
              onClick={togglePreview}
              variant="outline"
              className="border-[#A796CB]/30 hover:bg-[#A796CB]/10 bg-transparent"
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? t("simulation.hidePreview") : t("simulation.showPreview")}
            </Button>
          </div>

          {/* Physics Concepts */}
          {structuredData?.key_concepts && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">{t("simulation.physicsConceptsTitle")}</h4>
              <div className="flex flex-wrap gap-2">
                {structuredData.key_concepts.map((concept: string, index: number) => (
                  <Badge key={index} className="bg-[#A796CB]/10 border-[#A796CB]/30 text-[#7962A6]">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">{t("simulation.simulationFeatures")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.slice(0, 6).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>{feature.replace("✅ ", "")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 {t("simulation.howToUse")}</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>{t("simulation.bestExperience")}</strong>
              </li>
              <li>
                • <strong>{t("simulation.offlineUse")}</strong>
              </li>
              <li>
                • <strong>{t("simulation.controls")}</strong>
              </li>
              <li>
                • <strong>{t("simulation.reset")}</strong>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
