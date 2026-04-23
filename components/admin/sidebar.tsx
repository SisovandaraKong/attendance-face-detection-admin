"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "DB" },
  { href: "/attendance", label: "Attendance", icon: "AT" },
  { href: "/persons", label: "Persons", icon: "PS" },
];

export function Sidebar() {
  const pathname = usePathname();

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
        {navItems.map((item) => {
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

      <p className="sidebar-note">FastAPI + Next.js split architecture</p>
    </aside>
  );
}
