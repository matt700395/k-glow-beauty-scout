import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Link2, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import { useAuth } from "@/contexts/AuthContext";
import { logEvent } from "@/utils/events";
import { toast } from "sonner";
import detailData from "@/data/routes/product-detail.json";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("saved_ids") || "[]")
  );

  const { product, similar_products } = detailData;
  const isSaved = savedIds.includes(product.id);

  useEffect(() => { logEvent("PAGE_VIEW", { page: "product_detail" }); }, []);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [productId]);

  const toggleSave = () => {
    if (!isLoggedIn) { navigate(`/auth?next=/p/${productId}&intent=save`); return; }
    const next = isSaved ? savedIds.filter((x) => x !== product.id) : [...savedIds, product.id];
    setSavedIds(next);
    localStorage.setItem("saved_ids", JSON.stringify(next));
    logEvent("SAVE_TOGGLE", { productId: product.id, action: isSaved ? "unsave" : "save" });
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("링크가 복사되었습니다");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-2xl py-6 space-y-4">
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
          <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-2xl py-6 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> 뒤로
        </Button>

        {/* Product header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-80 h-64 md:h-80 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 space-y-3">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.brand}</p>
            <div className="flex flex-wrap gap-1.5">
              {[product.category, product.finish, product.tone_fit, product.price_band].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-glow-subtle text-primary text-xs font-medium">{t}</span>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant={isSaved ? "default" : "outline"} size="sm" onClick={toggleSave} className="gap-1.5">
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} /> 저장
              </Button>
              <Button variant="outline" size="sm" onClick={share} className="gap-1.5">
                <Link2 className="w-4 h-4" /> 공유
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Recommendation reason */}
        <section>
          <h2 className="text-sm font-semibold mb-2">추천 근거</h2>
          <div className="rounded-xl gradient-glow-subtle p-4 space-y-2">
            <p className="text-sm">{product.explain_short}</p>
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((t) => (
                <span key={t} className="text-xs text-primary">• {t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section>
          <h2 className="text-sm font-semibold mb-2">성분 요약</h2>
          <p className="text-sm">핵심 성분: {product.ingredients_top.join(", ")}</p>
          {product.ingredients_caution.length > 0 && (
            <p className="text-sm text-destructive mt-1">⚠ 주의: {product.ingredients_caution.join(", ")}</p>
          )}
          <button onClick={() => setShowAllIngredients(!showAllIngredients)} className="flex items-center gap-1 text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors">
            전체 성분 보기
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllIngredients ? "rotate-180" : ""}`} />
          </button>
          {showAllIngredients && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-2 p-3 bg-muted rounded-lg">
              {product.ingredients_top.join(", ")}, 정제수, 글리세린, 부틸렌글라이콜, 1,2-헥산다이올...
            </motion.p>
          )}
        </section>

        {/* Texture */}
        <section>
          <h2 className="text-sm font-semibold mb-2">사용감 / 제형</h2>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">{t}</span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{product.texture_desc}</p>
        </section>

        {/* Similar */}
        <section>
          <h2 className="text-sm font-semibold mb-3">유사 제품</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {similar_products.map((sp) => (
              <button key={sp.id} onClick={() => navigate(`/p/${sp.id}`)} className="rounded-xl border border-border bg-card p-3 text-left hover:glow-shadow transition-shadow">
                <div className="w-full aspect-square rounded-lg bg-muted mb-2 overflow-hidden">
                  <img src={sp.image_url} alt={sp.name} className="w-full h-full object-contain" />
                </div>
                <p className="text-sm font-medium truncate">{sp.name}</p>
                <p className="text-xs text-muted-foreground">{sp.brand}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Report CTA */}
        <div className="rounded-xl gradient-glow p-6 text-center text-primary-foreground glow-shadow-lg">
          <Sparkles className="w-6 h-6 mx-auto mb-2" />
          <p className="font-semibold">이 제품 포함 루틴 리포트 만들기</p>
          <p className="text-sm opacity-90 mt-1 mb-4">AI가 AM/PM 루틴, 주의 조합을 분석합니다</p>
          <Button
            variant="outline"
            className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30"
            onClick={() => {
              if (!isLoggedIn) { navigate("/auth?intent=buy_report"); return; }
              setPaymentOpen(true);
            }}
          >
            리포트 만들기 — ₩4,900
          </Button>
        </div>
      </main>
      <Footer />
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} source="product" sourceId={productId} />
    </div>
  );
}
