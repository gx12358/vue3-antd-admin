import type { EventHandlerRequest, H3Event } from 'h3'

import type { UserDatabase } from './mock-data'

import { getHeader } from 'h3'
import jwt from 'jsonwebtoken'

import { MOCK_USERS } from './mock-data'

// TODO: Replace with your own secret key
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret'

export interface UserPayload extends UserDatabase {
  iat: number;
  exp: number;
}

export function generateAccessToken(user: UserDatabase) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
}

export function generateRefreshToken(user: UserDatabase) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  })
}

export function verifyAccessToken(
  event: H3Event<EventHandlerRequest>,
): null | Omit<UserDatabase, 'password'> {
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader?.startsWith('Bearer')) {
    return null
  }

  const tokenParts = authHeader.split(' ')
  if (tokenParts.length !== 2) {
    return null
  }
  const token = tokenParts[1] as string
  try {
    const decoded = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET,
    ) as unknown as UserPayload

    const username = decoded.username
    const user = MOCK_USERS.find(item => item.username === username)
    if (!user) {
      return null
    }
    const { password: _pwd, ...userinfo } = user
    return userinfo
  } catch {
    return null
  }
}

export function verifyRefreshToken(
  token: string,
): null | Omit<UserDatabase, 'password'> {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as UserPayload
    const username = decoded.username
    const user = MOCK_USERS.find(
      item => item.username === username,
    ) as UserDatabase
    if (!user) {
      return null
    }
    const { password: _pwd, ...userinfo } = user
    return userinfo
  } catch {
    return null
  }
}
