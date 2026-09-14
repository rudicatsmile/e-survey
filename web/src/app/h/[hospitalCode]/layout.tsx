import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { DUMMY_HOSPITALS } from "@/lib/dummy-data";

interface HospitalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ hospitalCode: string }>;
}

export default async function HospitalLayout({
  children,
  params,
}: HospitalLayoutProps) {
  const { hospitalCode } = await params;
  const hospital = DUMMY_HOSPITALS.find(
    (h) => h.code.toUpperCase() === hospitalCode.toUpperCase()
  ) || DUMMY_HOSPITALS[0];

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar
        hospitalCode={hospital.code}
        hospitalName={hospital.name}
        isSuperAdmin={false}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          currentHospitalCode={hospital.code}
          userRole="Administrator RS"
          userName="Dr. Ratna Kusuma, Sp.PK"
        />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
