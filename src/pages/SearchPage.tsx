import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SearchInsight from "@/components/SearchInsight";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import LoadingSteps from "@/components/LoadingSteps";
import PaymentModal from "@/components/PaymentModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { logEvent } from "@/utils/events";
import searchData from "@/data/routes/search.json";

const DEFAULT_FILTERS = { category: "all", priceBand: "all", fragrance: false, sensitive: false, excludeFragrance: false, excludeEthanol: false, excludeSilicone: false };

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(10);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("saved_ids") || "[]")
  );

  useEffect(() => { logEvent("PAGE_VIEW", { page: "search" }); }, []);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, [q]);

  const toggleSave = (id: string) => {
    const next = savedIds.includes(id) ? savedIds.filter((x) => x !== id) : [...savedIds, id];
    setSavedIds(next);
    localStorage.setItem("saved_ids", JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    return searchData.results.filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.priceBand !== "all" && p.price_band !== filters.priceBand) return false;
      if (filters.excludeFragrance && p.ingredients_caution.includes("향료")) return false;
      return true;
    });
  }, [filters]);

  if (!q) return <Navigate to="/" replace />;

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-2xl py-6 space-y-4">
        <SearchBar initialQuery={q} />

        {loading ? (
          <LoadingSteps />
        ) : (
          <>
            <SearchInsight intentSummary={searchData.intent_summary} meta={searchData.search_meta} />
            <FilterBar filters={filters} onChange={setFilters} />

            <p className="text-sm text-muted-foreground">{filtered.length}개 결과</p>

            <div className="space-y-3">
              {visible.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  saved={savedIds.includes(p.id)}
                  onToggleSave={toggleSave}
                  index={i}
                />
              ))}
            </div>

            {visible.length < filtered.length && (
              <div className="text-center">
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + 10)}>더 보기</Button>
              </div>
            )}

            {/* Bottom CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => navigate(isLoggedIn ? "/account" : "/auth")}
                className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors text-left"
              >
                <p className="font-semibold text-sm">👤 내 조건 저장</p>
                <p className="text-xs text-muted-foreground mt-1">추천이 더 정확해집니다</p>
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) { navigate(`/auth?next=/search?q=${encodeURIComponent(q)}&intent=buy_report`); return; }
                  setPaymentOpen(true);
                }}
                className="p-4 rounded-xl gradient-glow text-primary-foreground text-left glow-shadow hover:glow-shadow-lg transition-shadow"
              >
                <p className="font-semibold text-sm">✨ 프리미엄 루틴 리포트</p>
                <p className="text-xs opacity-90 mt-1">AI 맞춤 루틴을 만들어 보세요</p>
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} source="search" sourceId={q} />
    </div>
  );
}
