import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8168";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok || !payload.success || !payload.data?.access_token) {
    return NextResponse.json(
      { success: false, message: payload.detail || payload.message || "Login failed" },
      { status: response.status || 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", payload.data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({
    success: true,
    data: {
      username: payload.data.username,
      full_name: payload.data.full_name,
      role: payload.data.role,
    },
    message: "Login successful",
  });
}
