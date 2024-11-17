import { NextResponse } from 'next/server'
import {auth} from './auth'


 
export default  auth((request ) => {

  const { nextUrl } = request;

  const isLoggedIn = !!request.auth
  const publicPaths = ['/sign-in', '/sign-up', '/verify',]

  if (isLoggedIn && publicPaths.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }


  return NextResponse.next()
})

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    "/",
    '/verify', 
    '/dashboard/:path*'
],
}