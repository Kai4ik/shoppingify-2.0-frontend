import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyUser } from "./utils/auth";

export default async function middleware(
  req: NextRequest
): Promise<NextResponse> {
  const cookies = req.cookies.getAll();
  let idToken = "";
  cookies.forEach((cookie) => {
    if (Boolean(cookie.name.includes("idToken"))) idToken = cookie.value;
  });

  if (idToken.length === 0) {
    req.nextUrl.pathname = "/login";
    return NextResponse.redirect(req.nextUrl);
  }

  const ifLoggedIn = await verifyUser(idToken);
  if (Boolean(ifLoggedIn.succcess)) {
    return NextResponse.next();
  }

  req.nextUrl.pathname = "/login";
  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: "/protected/:path*",
};
