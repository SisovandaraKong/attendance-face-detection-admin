import type { ReactNode } from "react";

import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">{children}</div>
    </div>
  );
}
