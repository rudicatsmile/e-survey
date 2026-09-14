"use client";

import React, { useState, useEffect, use } from "react";
import { History, Search, Eye, X, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAuditLogsAction } from "@/actions/audit-actions";

interface HistoryLogsPageProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function HospitalHistoryLogsPage({ params }: HistoryLogsPageProps) {
  const resolvedParams = use(params);
  const hospitalCode = resolvedParams.hospitalCode.toUpperCase();

  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  useEffect(() => {
    getAuditLogsAction()
      .then((data) => {
        // Filter by hospital code or match tenant
        const filteredByHospital = data.filter(
          (l) => l.hospitalCode?.toUpperCase() === hospitalCode
        );
        setLogs(filteredByHospital);
      })
      .catch((err) => console.error("Error fetching hospital logs:", err))
      .finally(() => setLoading(false));
  }, [hospitalCode]);

  const filtered = logs.filter(
    (l) =>
      (l.actorName && l.actorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.notes && l.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.entityType && l.entityType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Badge variant="success">CREATE</Badge>;
      case "UPDATE":
        return <Badge variant="default">UPDATE</Badge>;
      case "PUBLISH":
        return <Badge variant="warning">PUBLISH</Badge>;
      case "ACTIVATE":
        return <Badge variant="success">ACTIVATE</Badge>;
      case "DELETE":
        return <Badge variant="destructive">DELETE</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`History Log & Audit Trail: ${hospitalCode}`}
        description="Rekam jejak setiap aksi pembuatan, pengubahan, penerbitan, atau penonaktifan kuesioner, unit, dan periode di RS ini dari database MySQL."
        breadcrumbs={[
          { label: hospitalCode, href: `/h/${hospitalCode}/dashboard` },
          { label: "History Log" },
        ]}
      />

      {/* Search */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari user, aksi, atau catatan..."
            className="pl-10"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Total: {filtered.length} Catatan
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs">Memuat log riwayat rumah sakit...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-3.5">Waktu Kejadian</th>
                    <th className="px-6 py-3.5">Pengguna / Aktor</th>
                    <th className="px-6 py-3.5">Entitas</th>
                    <th className="px-6 py-3.5">Aksi</th>
                    <th className="px-6 py-3.5">Catatan Perubahan</th>
                    <th className="px-6 py-3.5 text-right">Detail Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        Belum ada riwayat aktivitas perubahan untuk rumah sakit ini.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-[11px] text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-foreground">{log.actorName || "Petugas"}</p>
                          <p className="text-[10px] text-muted-foreground">{log.actorEmail || ""}</p>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-foreground">
                          {log.entityType}
                        </td>
                        <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                        <td className="px-6 py-4 text-foreground/80 max-w-sm truncate">
                          {log.notes || "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                            className="h-7 text-xs px-2.5"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Diff
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Diff */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Audit Diff: {selectedLog.entityType} ({selectedLog.action})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Oleh {selectedLog.actorName} pada{" "}
                  {new Date(selectedLog.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLog(null)}
                className="h-8 w-8 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-muted-foreground font-semibold">Catatan Pengubah:</span>
                <p className="font-medium text-foreground mt-0.5">{selectedLog.notes || "Tidak ada catatan"}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    State Sebelumnya (Before JSON):
                  </span>
                  <pre className="p-3 rounded-xl bg-muted font-mono text-[11px] text-muted-foreground overflow-x-auto max-h-48 border border-border">
                    {selectedLog.beforeJson
                      ? JSON.stringify(selectedLog.beforeJson, null, 2)
                      : "(Data baru / Null)"}
                  </pre>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    State Sesudahnya (After JSON):
                  </span>
                  <pre className="p-3 rounded-xl bg-muted font-mono text-[11px] text-emerald-700 dark:text-emerald-300 overflow-x-auto max-h-48 border border-border">
                    {selectedLog.afterJson
                      ? JSON.stringify(selectedLog.afterJson, null, 2)
                      : "(Dihapus / Null)"}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end">
              <Button size="sm" onClick={() => setSelectedLog(null)}>
                Tutup Detail
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
