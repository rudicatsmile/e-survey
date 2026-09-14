"use client";

import React, { useState, useEffect, use } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getHospitalReviewsAction,
  getSentimentSummaryAction,
} from "@/actions/review-actions";

interface ReviewsReportProps {
  params: Promise<{ hospitalCode: string }>;
}

export default function ReviewsReportPage({ params }: ReviewsReportProps) {
  const resolvedParams = use(params);
  const hospitalCode = resolvedParams.hospitalCode.toUpperCase();

  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("ALL");
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const [reviews, setReviews] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHospitalReviewsAction(hospitalCode, sentimentFilter),
      getSentimentSummaryAction(hospitalCode),
    ])
      .then(([reviewsData, summaryData]) => {
        setReviews(reviewsData);
        setSummary(summaryData);
      })
      .catch((err) => console.error("Error loading reviews:", err))
      .finally(() => setLoading(false));
  }, [hospitalCode, sentimentFilter]);

  const filteredReviews = reviews.filter((rev) => {
    const textMatch =
      (rev.reviewText && rev.reviewText.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rev.unitName && rev.unitName.toLowerCase().includes(searchTerm.toLowerCase()));

    const keywordMatch =
      !selectedKeyword ||
      (Array.isArray(rev.keywords) &&
        rev.keywords.some((k: string) =>
          k.toLowerCase().includes(selectedKeyword.toLowerCase())
        ));

    return textMatch && keywordMatch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Analisis Ulasan Kualitatif: ${hospitalCode}`}
        description="Ekstraksi sentimen dan kata kunci dari masukan bebas responden masyarakat di basis data MySQL."
        breadcrumbs={[
          { label: hospitalCode, href: `/h/${hospitalCode}/dashboard` },
          { label: "Laporan", href: `/h/${hospitalCode}/reports/satisfaction` },
          { label: "Analisis Ulasan" },
        ]}
      />

      {/* Top Keywords / Word Cloud Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Kata Kunci Paling Sering Muncul (Kamus Sentimen)
            </CardTitle>
            {selectedKeyword && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setSelectedKeyword(null)}
              >
                Hapus Filter Kata Kunci (#{selectedKeyword})
              </Button>
            )}
          </div>
          <CardDescription>
            Klik kata kunci untuk memfilter ulasan terkait secara langsung.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-1">
          {loading ? (
            <div className="py-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Menganalisis kata kunci...
            </div>
          ) : summary?.topKeywords?.length > 0 ? (
            summary.topKeywords.map((kw: any) => (
              <button
                key={kw.word}
                onClick={() =>
                  setSelectedKeyword(selectedKeyword === kw.word ? null : kw.word)
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedKeyword === kw.word
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted text-foreground border-border hover:bg-muted/80"
                }`}
              >
                <span>#{kw.word}</span>
                <span className="text-[10px] opacity-80">({kw.count})</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">Belum ada kata kunci terekstraksi.</p>
          )}
        </CardContent>
      </Card>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kata di ulasan atau nama unit..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { key: "ALL", label: `Semua (${summary?.totalReviews || 0})` },
            { key: "POSITIVE", label: `Positif (${summary?.positive || 0})` },
            { key: "NEUTRAL", label: `Netral (${summary?.neutral || 0})` },
            { key: "NEGATIVE", label: `Negatif (${summary?.negative || 0})` },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSentimentFilter(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                sentimentFilter === item.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Review Cards Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs">Memuat ulasan responden dari MySQL...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-card border border-dashed border-border rounded-2xl">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs font-semibold text-foreground">Tidak ada ulasan yang sesuai filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => (
            <Card key={rev.id} className="border-border hover:border-primary/40 transition-colors">
              <CardContent className="p-5 space-y-3 text-xs flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm truncate max-w-[200px]">
                      {rev.unitName || "Unit Layanan"}
                    </span>
                    <Badge
                      variant={
                        rev.sentiment === "POSITIVE"
                          ? "success"
                          : rev.sentiment === "NEGATIVE"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {rev.sentiment === "POSITIVE"
                        ? "Positif"
                        : rev.sentiment === "NEGATIVE"
                        ? "Negatif"
                        : "Netral"}
                    </Badge>
                  </div>
                  <p className="text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-xl border border-border/50">
                    &quot;{rev.reviewText}&quot;
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(rev.keywords) &&
                      rev.keywords.map((k: string) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium"
                        >
                          #{k}
                        </span>
                      ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>{new Date(rev.createdAt).toLocaleDateString("id-ID")}</span>
                    <span className="font-bold text-foreground">
                      Skor IKM: {rev.overallScore || "-"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
