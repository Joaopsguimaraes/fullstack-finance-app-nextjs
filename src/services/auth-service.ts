import { prisma } from '@/lib/prisma'
import type { RegisterData } from '@/lib/schemas'
import bcrypt from 'bcryptjs'
import { GenericError } from '../helpers/generic-error'
import { SessionService } from './session-service'

export class AuthService {
  static async register(data: RegisterData) {
    try {
      const existingUser = await this.emailExists(data.email)

      if (existingUser) {
        new GenericError('An account with this email address already exists')
      }

      const hashedPassword = await bcrypt.hash(data.password, 12)

      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          password: hashedPassword,
          name: `${data.firstName.trim()} ${data.lastName.trim()}`,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      })

      return user
    } catch (error) {
      console.error('User registration failed:', {
        email: data.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })

      if (error instanceof Error) {
        throw error
      }

      new GenericError('Failed to create user account. Please try again.')
    }
  }

  static async validateCredentials(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
        },
      })

      if (!user?.password) {
        return null
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return null
      }

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
      }
    } catch (error) {
      console.error('Credential validation error:', error)
      return null
    }
  }

  static async emailExists(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true },
      })

      return !!user
    } catch (error) {
      console.error('Email check error:', error)
      return false
    }
  }

  static async getCurrentAuthenticatedUser() {
    try {
      const validation = await SessionService.validateSession()

      if (!validation) return null

      return await prisma.user.findUnique({
        where: { id: validation.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    } catch (error) {
      console.error('Get current authenticated user error:', error)
      return null
    }
  }
}
