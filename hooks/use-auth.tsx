"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { type AuthState, authService } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: "municipal" | "ngo") => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    const user = authService.getCurrentUser()
    setAuthState({ user, isLoading: false })
  }, [])

  const login = async (email: string, password: string, role: "municipal" | "ngo") => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.login(email, password, role)
      setAuthState({ user, isLoading: false })
    } catch (error) {
      setAuthState({ user: null, isLoading: false })
      throw error
    }
  }

  const logout = async () => {
    await authService.logout()
    setAuthState({ user: null, isLoading: false })
  }

  return <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
