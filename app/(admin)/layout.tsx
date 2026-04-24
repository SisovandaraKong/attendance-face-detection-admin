import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/sidebar";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="admin-shell">
      <Sidebar session={session} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
