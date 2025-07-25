"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Library,
  Search,
  ExternalLink,
  Download,
  Trash2,
  Calendar,
  LogOut,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { useProfile } from "@/lib/hooks/use-profile"
import { useSimulations } from "@/lib/hooks/use-simulations"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSimulation, setSelectedSimulation] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [simulationToDelete, setSimulationToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { simulations, loading: simulationsLoading, error: simulationsError, deleteSimulation } = useSimulations()
  const { t } = useI18n()

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
            📚
          </div>
          <p className="text-gray-600">{t("library.loadingLibrary")}</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  const filteredSimulations = simulations.filter(
    (sim) =>
      sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.physics_concepts.some((concept) => concept.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const openSimulationInNewTab = (htmlContent: string) => {
    try {
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const newWindow = window.open(url, "_blank")

      if (!newWindow) {
        alert("Please allow popups for this site to open the simulation in a new tab.")
      }

      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } catch (error) {
      console.error("Error opening simulation:", error)
      alert("Failed to open simulation. Please try again.")
    }
  }

  const downloadSimulation = (simulation: any) => {
    try {
      const blob = new Blob([simulation.html_content], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${simulation.title.toLowerCase().replace(/\s+/g, "-")}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading simulation:", error)
      alert("Failed to download simulation.")
    }
  }

  const handleDeleteSimulation = async () => {
    if (!simulationToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteSimulation(simulationToDelete)
      if (result.error) {
        alert(`Failed to delete simulation: ${result.error}`)
      } else {
        setDeleteDialogOpen(false)
        setSimulationToDelete(null)
      }
    } catch (error: any) {
      alert(`Failed to delete simulation: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A796CB]/10 via-blue-50 to-[#7962A6]/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/app"
                className="flex items-center gap-2 text-gray-600 hover:text-[#7962A6] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                {t("nav.backToGenerator")}
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#7962A6] to-[#A796CB] bg-clip-text text-transparent">
                  {t("library.title")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7962A6] to-[#A796CB] bg-clip-text text-transparent">
                {t("library.title")}
              </h1>
              <p className="text-gray-500 text-lg mt-1">{t("library.description")}</p>
            </div>
          </div>
        </div>

        {/* Database Error Alert */}
        {simulationsError && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">
              <strong>Database Error:</strong> {simulationsError}
              {simulationsError.includes("Database table not found") && (
                <div className="mt-2">
                  <p className="text-sm">
                    The simulations table hasn't been created yet. Please run the database migration script.
                  </p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t("library.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base border-2 focus:border-[#A796CB]"
              disabled={!!simulationsError}
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              <span>
                {simulations.length} {t("library.simulations")}
              </span>
            </div>
            {searchQuery && (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>
                  {filteredSimulations.length} {t("library.results")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {simulationsLoading && !simulationsError && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#7962A6]" />
            <p className="text-gray-600">{t("common.loading")}</p>
          </div>
        )}

        {/* Empty State */}
        {!simulationsLoading && !simulationsError && simulations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Library className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{t("library.noSimulationsYet")}</h3>
              <p className="text-gray-500 mb-6">{t("library.startCreating")}</p>
              <Link href="/app">
                <Button className="bg-gradient-to-r from-[#7962A6] to-[#A796CB] hover:from-[#6B5595] hover:to-[#9B89BA]">
                  {t("library.createFirst")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {!simulationsLoading &&
          !simulationsError &&
          simulations.length > 0 &&
          filteredSimulations.length === 0 &&
          searchQuery && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t("library.noResults")}</h3>
                <p className="text-gray-500 mb-4">
                  {t("library.noResultsDescription")} "{searchQuery}"
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  {t("library.clearSearch")}
                </Button>
              </CardContent>
            </Card>
          )}

        {/* Simulations Grid */}
        {!simulationsLoading && !simulationsError && filteredSimulations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSimulations.map((simulation) => (
              <Card
                key={simulation.id}
                className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800 group-hover:text-[#7962A6] transition-colors line-clamp-2">
                        {simulation.title}
                      </CardTitle>
                      {simulation.description && (
                        <CardDescription className="mt-2 line-clamp-2">{simulation.description}</CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(simulation.created_at)}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Physics Concepts */}
                  {simulation.physics_concepts.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {simulation.physics_concepts.slice(0, 3).map((concept: string, index: number) => (
                          <Badge key={index} className="text-xs bg-[#A796CB]/10 border-[#A796CB]/30 text-[#7962A6]">
                            {concept}
                          </Badge>
                        ))}
                        {simulation.physics_concepts.length > 3 && (
                          <Badge className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                            +{simulation.physics_concepts.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openSimulationInNewTab(simulation.html_content)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {t("library.open")}
                    </Button>
                    <Button
                      onClick={() => downloadSimulation(simulation)}
                      size="sm"
                      variant="outline"
                      className="border-green-200 hover:bg-green-50 text-green-600"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => {
                        setSimulationToDelete(simulation.id)
                        setDeleteDialogOpen(true)
                      }}
                      size="sm"
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("library.deleteSimulation")}</DialogTitle>
              <DialogDescription>{t("library.deleteConfirmation")}</DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDeleteSimulation}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("library.deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("library.deleteSimulation")}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                {t("library.cancel")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
