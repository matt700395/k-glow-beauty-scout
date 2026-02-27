import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { logEvent } from "@/utils/events";

interface SearchBarProps {
  initialQuery?: string;
  large?: boolean;
}

export default function SearchBar({ initialQuery = "", large }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    if (query.trim().length < 2) {
      setError("2자 이상 입력해주세요");
      return;
    }
    setError("");
    logEvent("SEARCH_SUBMIT", { query: query.trim(), source: large ? "home" : "header" });
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`relative border border-input rounded-xl bg-background focus-within:ring-2 focus-within:ring-ring transition-shadow ${large ? "glow-shadow" : ""}`}>
        <div className="flex items-start gap-2 p-3">
          <Search className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
          <textarea
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="원하는 무드, 피부 고민, 제형을 자유롭게 입력하세요..."
            rows={large ? 2 : 1}
            className="flex-1 bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center justify-between px-3 pb-3">
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex-1" />
          <Button variant="glow" size="sm" onClick={submit} className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            추천 받기
          </Button>
        </div>
      </div>
    </div>
  );
}
