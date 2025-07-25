"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Brain, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const router = useRouter()
  const { signIn, signUp, user } = useAuth()
  const { t, language } = useI18n()

  // Redirect if already logged in
  if (user) {
    router.push("/app")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isLogin) {
        // Sign in
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          setError(error.message)
        } else {
          router.push("/app")
        }
      } else {
        // Sign up
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long")
          return
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName)
        if (error) {
          setError(error.message)
        } else {
          setSuccess("Account created successfully! Please check your email to verify your account.")
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
          })
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A796CB]/10 via-blue-50 to-[#7962A6]/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#7962A6] to-[#A796CB] bg-clip-text text-transparent">
                {t("app.title")}
              </span>
            </Link>
            <LanguageSwitcher />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}
          </h1>
          <p className="text-gray-600">{isLogin ? t("auth.signInDescription") : t("auth.signUpDescription")}</p>
        </div>

        {/* Login/Signup Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">{isLogin ? t("auth.signIn") : t("auth.signUp")}</CardTitle>
            <CardDescription className="text-center">
              {isLogin ? t("auth.enterCredentials") : t("auth.createAccountDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("auth.fullName")}</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder={t("auth.enterFullName")}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="h-12"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("auth.enterEmail")}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.enterPassword")}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.confirmPasswordPlaceholder")}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="h-12 pl-10"
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded" />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      {t("auth.rememberMe")}
                    </Label>
                  </div>
                  <Link href="#" className="text-sm text-[#7962A6] hover:text-[#6B5595]">
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base bg-gradient-to-r from-[#7962A6] to-[#A796CB] hover:from-[#6B5595] hover:to-[#9B89BA]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isLogin ? t("auth.signingIn") : t("auth.creatingAccount")}
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    {isLogin ? t("auth.signIn") : t("auth.createAccount")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Switch Mode */}
            <div className="text-center">
              <p className="text-gray-600">
                {isLogin ? t("auth.dontHaveAccount") : t("auth.alreadyHaveAccount")}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError(null)
                    setSuccess(null)
                    setFormData({
                      email: "",
                      password: "",
                      confirmPassword: "",
                      fullName: "",
                    })
                  }}
                  className="ml-2 text-[#7962A6] hover:text-[#6B5595] font-medium"
                  disabled={isLoading}
                >
                  {isLogin ? t("auth.signUp") : t("auth.signIn")}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">{t("auth.accessFeatures")}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {(() => {
              const getFeaturesPreviews = () => {
                const featuresMap: Record<string, string[]> = {
                  en: ["AI Physics Engine", "Real-time Simulations", "Smart Controls", "Vector Visualization"],
                  id: ["Mesin Fisika AI", "Simulasi Real-time", "Kontrol Cerdas", "Visualisasi Vektor"],
                }
                return featuresMap[language] || featuresMap.en
              }

              return getFeaturesPreviews().map((feature: string) => (
                <span key={feature} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">
                  {feature}
                </span>
              ))
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
