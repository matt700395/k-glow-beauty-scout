import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { logEvent } from "@/utils/events";
import homeData from "@/data/routes/home.json";

const { settings, recent_searches } = homeData;

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => { logEvent("PAGE_VIEW", { page: "home" }); }, []);

  const goSearch = (q: string) => {
    logEvent("CLICK_EXAMPLE_CHIP", { chip: q });
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-2xl py-16 space-y-10">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <div className="inline-flex items-center gap-2 text-3xl md:text-4xl font-bold">
              <Sparkles className="w-7 h-7 text-primary animate-float" />
              <span className="gradient-text">K-Glow AI Search</span>
            </div>
            <p className="text-muted-foreground">
              원하는 무드·피부 상태를 자연어로 입력하세요
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SearchBar large />
          </motion.div>

          {/* Example chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-2">
            {settings.example_chips.map((chip) => (
              <Button key={chip} variant="chip" size="sm" onClick={() => goSearch(chip)}>
                {chip}
              </Button>
            ))}
          </motion.div>

          {/* Example sentences */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-1.5">
              💬 이렇게도 검색해 보세요
            </p>
            <div className="space-y-2">
              {settings.example_sentences.map((s) => (
                <button
                  key={s}
                  onClick={() => goSearch(s)}
                  className="w-full text-left p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors flex items-center justify-between group text-sm"
                >
                  <span className="text-muted-foreground">"{s}"</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent searches */}
          {isLoggedIn && recent_searches.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-2">
              <p className="text-sm font-medium">최근 검색</p>
              {recent_searches.map((s) => (
                <div key={s.query} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border text-sm">
                  <span>{s.query}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => goSearch(s.query)}>
                    다시 보기
                  </Button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Trend tags */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center space-y-2">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 인기
            </p>
            <div className="flex justify-center gap-2">
              {settings.trend_tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-glow-subtle text-primary text-xs font-medium cursor-pointer hover:glow-shadow transition-shadow" onClick={() => goSearch(t)}>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
