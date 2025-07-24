"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth/context"

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  let supabase: any = null
  try {
    supabase = createClient()
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err)
    setLoading(false)
  }

  useEffect(() => {
    if (!user || !supabase) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
        } else {
          setProfile(data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, supabase])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !supabase) return { error: "No user logged in or Supabase not initialized" }

    try {
      const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

      if (error) {
        return { error }
      }

      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { error }
    }
  }

  return { profile, loading, updateProfile }
}
