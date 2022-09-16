import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !(token.role === "ADMIN" || token.role === "DEVELOPER")) {
    req.nextUrl.pathname = "/models";
    return NextResponse.redirect(req.nextUrl);
  }
}

export const config = {
  matcher: "/dev",
};
