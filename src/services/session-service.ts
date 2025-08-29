import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Session } from 'next-auth'

export interface SessionValidationResult {
  isValid: boolean
  session: Session
  user: Session['user']
}

export interface AuthenticatedUser {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export class SessionService {
  static async validateSession(): Promise<SessionValidationResult | null> {
    try {
      const session = await auth()

      if (!session) return null
      if (!session.user) return null

      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      })

      if (!user) return null

      return {
        isValid: true,
        session,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      }
    } catch (error) {
      console.error('Session validation error:', error)
      return null
    }
  }

  static async getCurrentUser(): Promise<AuthenticatedUser | null> {
    try {
      const validation = await this.validateSession()

      if (!validation) return null

      const user = await prisma.user.findUnique({
        where: {
          id: validation.user.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user?.email) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const session = await auth()
      return !!session
    } catch (error) {
      console.error('Authentication check error:', error)
      return false
    }
  }

  static async getUserId(): Promise<string | null> {
    try {
      const session = await auth()
      return session?.user?.id || null
    } catch (error) {
      console.error('Get user ID error:', error)
      return null
    }
  }

  static async validateUserExists(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      })

      return !!user
    } catch (error) {
      console.error('User existence validation error:', error)
      return false
    }
  }

  static async getSessionForUser(userId: string): Promise<Session | null> {
    try {
      const validation = await this.validateSession()

      if (!validation || validation.user?.id !== userId) return null

      return validation.session
    } catch (error) {
      console.error('Get session for user error:', error)
      return null
    }
  }

  static async refreshSession(): Promise<SessionValidationResult | null> {
    return await this.validateSession()
  }
}
