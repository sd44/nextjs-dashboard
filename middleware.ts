import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// import { NextResponse } from 'next/server';
// import {getTokenFromCookie} from './myauth.ts';

export default NextAuth(authConfig).auth;

// export function customHeadersMiddleware(request) {
//   const response = NextResponse.next();

//   const x = await getTokenFromCookie('access');
//   if (x) {
//   response.headers.set('Content-Type', 'application/json');
//   response.cookies.set('Authorization', 'Bearer '+ x);
//   }
//   return response;
// }

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
