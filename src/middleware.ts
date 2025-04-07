import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedPaths = [
    "/profile",
    // "/dashboard/certificate",
    // "/dashboard/mycourses",
    // "/dashboard/allcourses",
    // "/dashboard/profile",
    // "/dashboard/support",
    // "/dashboard/updates",
    // "/dashboard/enroll",
    // "/dashboard/mycourses/:path*",
    '/'
  ];
  const authPaths = ["/login", "/signup"];
  const token = request.cookies.get("authToken");
  
  if (protectedPaths.includes(path) && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (authPaths.includes(path) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    // "/profile",
    // "/dashboard/mycourses",
    // "/dashboard/allcourses",
    // "/dashboard/certificate",
    // "/dashboard/profile",
    // "/dashboard/support",
    // "/dashboard/updates",
    // "/dashboard/enroll",
    // "/dashboard/mycourses/:id*",
    // "/contact",
    // "/courses",
    // "/course/:id*",
  ],
};
