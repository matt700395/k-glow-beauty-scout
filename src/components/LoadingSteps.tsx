import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "검색어를 분석하고 있어요...",
  "맞춤 제품을 탐색 중이에요...",
  "최적의 결과를 정리하고 있어요...",
];

export default function LoadingSteps() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, 2));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const progress = ((step + 1) / 3) * 100;

  return (
    <div className="max-w-md mx-auto py-16 space-y-6">
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full gradient-glow rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-center text-sm text-muted-foreground"
        >
          {STEPS[step]}
        </motion.p>
      </AnimatePresence>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3 p-4 rounded-xl bg-card border border-border animate-pulse">
            <div className="w-16 h-16 rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-3 w-1/4 bg-muted rounded" />
              <div className="h-3 w-2/3 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
