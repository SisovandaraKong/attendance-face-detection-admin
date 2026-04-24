import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="login-brand">
          <div className="brand-badge">FD</div>
          <div>
            <p className="brand-title">Attendance Management Admin</p>
            <p className="brand-subtitle">Bank staff attendance control portal</p>
          </div>
        </div>

        <div className="login-copy">
          <p className="login-eyebrow">Secure Admin Access</p>
          <h1>Sign in to continue</h1>
          <p>
            This admin portal is restricted to authorized bank operations staff.
            Use your assigned admin credentials to access attendance management.
          </p>
        </div>

        <LoginForm />

        <div className="login-note">
          <strong>Role model</strong>
          <p>
            <code>super_admin</code> can access all admin modules. <code>hr_admin</code> can
            manage attendance and employee operations but not system-only controls.
          </p>
        </div>
      </section>
    </main>
  );
}
