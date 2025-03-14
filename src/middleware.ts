import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface User {
    userId: string;
    role?: string;
}

export async function middleware(request: NextRequest) {
    let user: User | null = null;
    const cookieStore = await cookies(); 
    const token = cookieStore.get('token')?.value; 
    const pathname = request.nextUrl.pathname;

    if (token) {
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_AUTH as string));

            if (payload.userId) {
                const response = NextResponse.next();
                response.headers.set('role', payload.role);

                return response;

            } else {
                if (!['/login', '/signup'].includes(pathname)) {
                  return NextResponse.redirect(new URL(`/login?${request.nextUrl.search}`, request.url));
                }
            }
      
        } catch (error) {
            console.error("JWT verification failed:", (error as Error).message);
        }
    } else {
        if(!['/login', '/signup'].includes(pathname)){
            return NextResponse.redirect(new URL(`/login?${request.nextUrl.search}`, request.url));
        }
    }
}

export const config = {
    matcher: ['/', '/signup', '/login']
}