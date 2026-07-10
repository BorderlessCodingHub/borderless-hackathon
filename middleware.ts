import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifySession } from '@/lib/admin-session'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin') return NextResponse.next()

  const token = req.cookies.get(ADMIN_COOKIE)?.value
  const ok = await verifySession(token)
  if (ok) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/admin'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
