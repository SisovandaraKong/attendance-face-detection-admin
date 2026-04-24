"use client";

import { useState } from "react";

export function PersonCreateForm() {
  const [employeeCode, setEmployeeCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_code: employeeCode,
          full_name: fullName,
          email: email || null,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        detail?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.detail || payload.message || "Failed to create employee");
      }

      setEmployeeCode("");
      setFullName("");
      setEmail("");
      setMessage("Employee created. Refresh to load the new registration card.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="create-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          <span>Employee Code</span>
          <input
            value={employeeCode}
            onChange={(event) => setEmployeeCode(event.target.value)}
            placeholder="EMP-001"
            required
          />
        </label>
        <label>
          <span>Full Name</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Sokha Chan"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="sokha@bank.local"
            type="email"
          />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Register Employee"}
        </button>
        {message ? <p>{message}</p> : null}
      </div>
    </form>
  );
}
