import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar isSuperAdmin={true} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          userRole="Super Admin Platform"
          userName="Hendra Wijaya, S.Kom., M.T."
        />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
