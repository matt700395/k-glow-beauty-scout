import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2, FileDown, Search, Sun, Moon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { logEvent } from "@/utils/events";
import { toast } from "sonner";
import reportData from "@/data/routes/report.json";

export default function ReportPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { report, alt_products } = reportData;

  useEffect(() => { logEvent("PAGE_VIEW", { page: "report" }); logEvent("REPORT_VIEW", { reportId: report.reportId }); }, []);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-2xl py-6">
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-2xl py-6 space-y-6">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{report.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">{new Date(report.created_at).toLocaleDateString("ko")}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(window.location.href); toast("링크 복사됨"); }}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toast("PDF 다운로드는 준비 중입니다")}>
              <FileDown className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="rounded-xl gradient-glow-subtle p-5">
          <p className="text-sm">{report.summary}</p>
        </div>

        {/* AM/PM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm flex items-center gap-1.5 mb-3">
              <Sun className="w-4 h-4 text-accent" /> AM 루틴
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {report.routine_am.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm flex items-center gap-1.5 mb-3">
              <Moon className="w-4 h-4 text-primary" /> PM 루틴
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {report.routine_pm.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        </div>

        {/* Reasoning */}
        <section>
          <h2 className="text-sm font-semibold mb-2">조합 근거</h2>
          <ul className="space-y-1.5">
            {report.reasoning.map((r, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary shrink-0">•</span> {r}
              </li>
            ))}
          </ul>
        </section>

        {/* Warnings */}
        {report.warnings.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-destructive" /> 주의 조합
            </h2>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              {report.warnings.map((w, i) => (
                <p key={i} className="text-sm text-destructive">{w}</p>
              ))}
            </div>
          </section>
        )}

        {/* Alternatives */}
        <section>
          <h2 className="text-sm font-semibold mb-3">대체 제품</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {alt_products.map((p) => (
              <button key={p.id} onClick={() => navigate(`/p/${p.id}`)} className="rounded-xl border border-border bg-card p-3 text-left hover:glow-shadow transition-shadow">
                <div className="w-full aspect-square rounded-lg bg-muted mb-2 overflow-hidden">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.brand}</p>
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
