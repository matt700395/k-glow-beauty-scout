import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CompareModal from "@/components/CompareModal";
import { logEvent } from "@/utils/events";
import savedData from "@/data/routes/saved.json";

export default function SavedPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(savedData.products);
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => { logEvent("PAGE_VIEW", { page: "saved" }); }, []);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const toggleSave = (id: string) => {
    setProducts((p) => p.filter((x) => x.id !== id));
    logEvent("SAVE_TOGGLE", { productId: id, action: "unsave" });
  };

  const toggleCheck = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s);
  };

  const selectedProducts = products.filter((p) => selected.includes(p.id));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-2xl py-6 space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-2xl py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">저장한 제품</h1>
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={() => { setCompareMode(!compareMode); setSelected([]); }}
            className="gap-1.5"
          >
            <ArrowLeftRight className="w-4 h-4" /> 비교 모드
          </Button>
        </div>

        {compareMode && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
            <span className="text-sm">{selected.length}/3 선택됨</span>
            <Button size="sm" disabled={selected.length < 2} onClick={() => setCompareOpen(true)}>비교 보기</Button>
          </motion.div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-4xl">💄</p>
            <p className="text-muted-foreground">저장한 제품이 없습니다</p>
            <Button variant="glow" onClick={() => navigate("/")}>검색하러 가기</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                saved
                onToggleSave={toggleSave}
                showCheckbox={compareMode}
                checked={selected.includes(p.id)}
                onCheck={toggleCheck}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} products={selectedProducts as any} />
    </div>
  );
}
