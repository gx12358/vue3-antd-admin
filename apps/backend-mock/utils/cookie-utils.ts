import type { EventHandlerRequest, H3Event } from 'h3'

import { deleteCookie, getCookie, getHeader, setCookie } from 'h3'

export function clearRefreshTokenCookie(event: H3Event<EventHandlerRequest>) {
  deleteCookie(event, 'Authorization', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
}

export function setRefreshTokenCookie(
  event: H3Event<EventHandlerRequest>,
  refreshToken: string,
) {
  setCookie(event, 'Authorization', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60, // unit: seconds
    sameSite: 'none',
    secure: true,
  })
}

export function getRefreshTokenFromCookie(event: H3Event<EventHandlerRequest>) {
  const refreshToken = getCookie(event, 'Authorization')
  return refreshToken
}

export function clearTenantCookie(event: H3Event<EventHandlerRequest>) {
  deleteCookie(event, 'tenant-id', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
}

export function setTenantCookie(
  event: H3Event<EventHandlerRequest>,
  value: string,
) {
  setCookie(event, 'tenant-id', value, {
    httpOnly: true,
    maxAge: 24 * 60 * 60, // unit: seconds
    sameSite: 'none',
    secure: true,
  })
}

export function getTenantCookie(event: H3Event<EventHandlerRequest>) {
  const tenandId = getHeader(event, 'tenant-id')
  return tenandId
}
