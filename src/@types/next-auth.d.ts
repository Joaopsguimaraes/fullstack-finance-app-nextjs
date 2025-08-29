import { type DefaultSession, type DefaultUser } from 'next-auth'
import { type DefaultJWT } from 'next-auth/jwt'

/**
 * Module augmentation for NextAuth types
 *
 * This file extends the default NextAuth types to include
 * custom properties in the session and JWT token.
 */

declare module 'next-auth' {
  /**
   * Extended Session interface
   *
   * Adds custom properties to the default session object
   */
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }

  /**
   * Extended User interface
   *
   * Adds custom properties to the default user object
   */
  interface User extends DefaultUser {
    id: string
    email: string
    name?: string | null
    password?: string | null
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT interface
   *
   * Adds custom properties to the default JWT token
   */
  interface JWT extends DefaultJWT {
    id: string
  }
}
