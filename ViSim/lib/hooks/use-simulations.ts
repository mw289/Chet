"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth/context"

interface Simulation {
  id: string
  user_id: string
  title: string
  description: string | null
  html_content: string
  physics_concepts: string[]
  features: string[]
  created_at: string
  updated_at: string
}

export function useSimulations() {
  const { user } = useAuth()
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  let supabase: any = null
  try {
    supabase = createClient()
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err)
    setError("Failed to initialize database connection")
    setLoading(false)
  }

  useEffect(() => {
    if (!user || !supabase) {
      setSimulations([])
      setLoading(false)
      return
    }

    fetchSimulations()
  }, [user, supabase])

  const fetchSimulations = async () => {
    if (!supabase || !user) return

    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from("simulations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Error fetching simulations:", fetchError)
        if (fetchError.message.includes('relation "public.simulations" does not exist')) {
          setError("Database table not found. Please run the database migration script.")
        } else {
          setError(`Database error: ${fetchError.message}`)
        }
      } else {
        setSimulations(data || [])
        setError(null)
      }
    } catch (error: any) {
      console.error("Error fetching simulations:", error)
      setError(`Failed to fetch simulations: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const saveSimulation = async (simulationData: {
    title: string
    description?: string
    html_content: string
    physics_concepts?: string[]
    features?: string[]
  }) => {
    if (!user || !supabase) return { error: "No user logged in or Supabase not initialized" }

    try {
      const { data, error: insertError } = await supabase
        .from("simulations")
        .insert({
          user_id: user.id,
          title: simulationData.title,
          description: simulationData.description || null,
          html_content: simulationData.html_content,
          physics_concepts: simulationData.physics_concepts || [],
          features: simulationData.features || [],
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error saving simulation:", insertError)
        if (insertError.message.includes('relation "public.simulations" does not exist')) {
          return { error: "Database table not found. Please run the database migration script." }
        }
        return { error: insertError.message }
      }

      // Refresh the simulations list
      await fetchSimulations()
      return { data, error: null }
    } catch (error: any) {
      console.error("Error saving simulation:", error)
      return { error: error.message }
    }
  }

  const deleteSimulation = async (id: string) => {
    if (!user || !supabase) return { error: "No user logged in or Supabase not initialized" }

    try {
      const { error: deleteError } = await supabase.from("simulations").delete().eq("id", id).eq("user_id", user.id)

      if (deleteError) {
        console.error("Error deleting simulation:", deleteError)
        return { error: deleteError.message }
      }

      // Refresh the simulations list
      await fetchSimulations()
      return { error: null }
    } catch (error: any) {
      console.error("Error deleting simulation:", error)
      return { error: error.message }
    }
  }

  const updateSimulation = async (id: string, updates: Partial<Simulation>) => {
    if (!user || !supabase) return { error: "No user logged in or Supabase not initialized" }

    try {
      const { data, error: updateError } = await supabase
        .from("simulations")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating simulation:", updateError)
        return { error: updateError.message }
      }

      // Refresh the simulations list
      await fetchSimulations()
      return { data, error: null }
    } catch (error: any) {
      console.error("Error updating simulation:", error)
      return { error: error.message }
    }
  }

  return {
    simulations,
    loading,
    error,
    saveSimulation,
    deleteSimulation,
    updateSimulation,
    refreshSimulations: fetchSimulations,
  }
}
