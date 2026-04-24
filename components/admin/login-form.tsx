"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected login error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label>
        <span>Username</span>
        <input
          autoComplete="username"
          onChange={(event) => setUsername(event.target.value)}
          placeholder="admin"
          required
          value={username}
        />
      </label>

      <label>
        <span>Password</span>
        <input
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          required
          type="password"
          value={password}
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign In"}
      </button>

      {message ? <p className="form-error">{message}</p> : null}
    </form>
  );
}
