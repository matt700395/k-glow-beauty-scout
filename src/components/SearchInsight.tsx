import { useState } from "react";
import { ChevronDown, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchInsightProps {
  intentSummary: string;
  meta: {
    model: string;
    embedding_dim: number;
    match_threshold: number;
    candidates_found: number;
    results_after_filter: number;
    top_similarity: number;
    avg_similarity: number;
    top_brands: string[];
    top_tags: string[];
    category_distribution: Record<string, number>;
  };
}

export default function SearchInsight({ intentSummary, meta }: SearchInsightProps) {
  const [open, setOpen] = useState(false);
  const catEntries = Object.entries(meta.category_distribution);
  const maxCat = Math.max(...catEntries.map(([, v]) => v));

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Brain className="w-4 h-4 text-primary" />
          AI 벡터 검색 분석
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 text-xs">
              <p className="text-muted-foreground">{intentSummary}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-muted-foreground">
                <span>모델: {meta.model} ({meta.embedding_dim}d)</span>
                <span>임계값: {meta.match_threshold}</span>
                <span>후보: {meta.candidates_found}개 → 필터 후: {meta.results_after_filter}개</span>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-muted-foreground">
                  <span>유사도 분포</span>
                  <span>Top: {meta.top_similarity} / Avg: {meta.avg_similarity}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-glow rounded-full" style={{ width: `${meta.avg_similarity * 100}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">카테고리 분포</p>
                  {catEntries.map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-2 mb-1">
                      <span className="w-16">{cat}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(count / maxCat) * 100}%` }} />
                      </div>
                      <span className="w-4 text-right">{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium mb-2">상위 태그</p>
                  <div className="flex flex-wrap gap-1">
                    {meta.top_tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-glow-subtle text-primary text-[10px]">#{t}</span>
                    ))}
                  </div>
                  <p className="font-medium mt-3 mb-1">상위 브랜드</p>
                  <p className="text-muted-foreground">{meta.top_brands.join(", ")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
