"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";
import type { AdminSession } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "DB" },
  { href: "/attendance", label: "Attendance", icon: "AT" },
  { href: "/persons", label: "Persons", icon: "PS" },
  { href: "/recognition-events", label: "Recognition", icon: "RE" },
  { href: "/reports", label: "Reports", icon: "RP" },
  { href: "/system", label: "System", icon: "SY", roles: ["super_admin"] },
];

export function Sidebar({ session }: { session: AdminSession }) {
  const pathname = usePathname();
  const normalizedRole = session.role;

  return (
    <aside className="admin-sidebar">
      <div className="brand">
        <div className="brand-badge">FD</div>
        <div>
          <p className="brand-title">Face Detection Admin</p>
          <p className="brand-subtitle">Attendance Control Room</p>
        </div>
      </div>

      <nav className="nav-list">
        {navItems
          .filter((item) => !item.roles || item.roles.includes(normalizedRole))
          .map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "nav-item active" : "nav-item"}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
          })}
      </nav>

      <div className="sidebar-user-card">
        <p className="sidebar-user-name">{session.full_name}</p>
        <p className="sidebar-user-role">{session.role}</p>
      </div>
      <LogoutButton />
      <p className="sidebar-note">FastAPI + Next.js split architecture</p>
    </aside>
  );
}
