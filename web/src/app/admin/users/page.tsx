"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Search, Plus, Shield, Building2, CheckCircle2, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_USERS } from "@/lib/dummy-data";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredUsers = DUMMY_USERS.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge variant="warning">Super Admin</Badge>;
      case "HOSPITAL_ADMIN":
        return <Badge variant="default">Admin RS</Badge>;
      case "FIELD_OFFICER":
        return <Badge variant="secondary">Petugas Lapangan</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Pengguna Lintas Rumah Sakit"
        description="Kelola akun Super Admin, Administrator Rumah Sakit, dan Petugas Survei Lapangan."
        breadcrumbs={[
          { label: "Super Admin", href: "/admin/dashboard" },
          { label: "Pengguna Platform" },
        ]}
        actions={
          <Link href="/admin/users/new">
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-1.5" />
              Tambah Pengguna Baru
            </Button>
          </Link>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau email pengguna..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["ALL", "SUPER_ADMIN", "HOSPITAL_ADMIN", "FIELD_OFFICER"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === role
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {role === "ALL"
                ? "Semua Role"
                : role === "SUPER_ADMIN"
                ? "Super Admin"
                : role === "HOSPITAL_ADMIN"
                ? "Admin RS"
                : "Petugas"}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Nama Pengguna & Email</th>
                  <th className="px-6 py-3.5">Peran / Role</th>
                  <th className="px-6 py-3.5">Afiliasi Rumah Sakit</th>
                  <th className="px-6 py-3.5">Unit Ditugaskan</th>
                  <th className="px-6 py-3.5">Terakhir Login</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{u.fullName}</p>
                          <p className="text-[11px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {u.hospitalName || "— (Akses Global)"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {u.assignedUnitName || "Semua Unit"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {u.lastLoginAt}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="default" className="text-[10px]">Aktif</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
