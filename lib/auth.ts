export interface User {
  id: string
  email: string
  name: string
  role: "municipal" | "ngo"
  organization?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Mock authentication - in production, replace with real JWT/session management
class AuthService {
  private currentUser: User | null = null

  async login(email: string, password: string, role: "municipal" | "ngo"): Promise<User> {
    // Mock authentication logic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password) {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
        role,
        organization: role === "ngo" ? "Sample NGO" : "Municipal Office",
      }

      this.currentUser = user
      localStorage.setItem("auth_user", JSON.stringify(user))
      return user
    }

    throw new Error("Invalid credentials")
  }

  async logout(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem("auth_user")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    const stored = localStorage.getItem("auth_user")
    if (stored) {
      this.currentUser = JSON.parse(stored)
      return this.currentUser
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const authService = new AuthService()
