import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { logEvent } from "@/utils/events";
import { toast } from "sonner";
import accountData from "@/data/routes/account.json";

const SKIN_TYPES = ["건성", "지성", "복합", "민감"];
const TONES = ["웜", "쿨", "뉴트럴", "모름"];
const CONCERNS = ["홍조", "트러블", "속건조", "모공", "각질", "잡티", "주름", "다크서클"];
const EXCLUDE = ["향료", "에탄올", "실리콘", "파라벤"];
const BUDGETS = ["1-3만", "3-5만", "5만+"];

export default function AccountPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"prefs" | "logs">("prefs");
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState(accountData.preferences);

  useEffect(() => { logEvent("PAGE_VIEW", { page: "account" }); }, []);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const chipBtn = (label: string, active: boolean, onClick: () => void) => (
    <Button key={label} variant={active ? "default" : "chip"} size="sm" className="h-8" onClick={onClick}>
      {label}
    </Button>
  );

  const toggleConcern = (c: string) => {
    setPrefs((p) => ({
      ...p,
      concerns: p.concerns.includes(c) ? p.concerns.filter((x) => x !== c) : [...p.concerns, c],
    }));
  };

  const toggleExclude = (e: string) => {
    setPrefs((p) => ({
      ...p,
      exclude_ingredients: p.exclude_ingredients.includes(e) ? p.exclude_ingredients.filter((x) => x !== e) : [...p.exclude_ingredients, e],
    }));
  };

  const save = () => {
    logEvent("PREFERENCES_SAVE", { prefs });
    toast("조건이 저장되었습니다");
  };

  const reset = () => {
    setPrefs({ skin_type: "", tone: "", concerns: [], fragrance_free: false, exclude_ingredients: [], budget_band: "" });
    logEvent("PREFERENCES_RESET");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-lg py-6">
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-lg py-6 space-y-6">
        <h1 className="text-xl font-bold">계정</h1>

        {/* Tabs */}
        <div className="flex rounded-lg bg-muted p-1">
          {(["prefs", "logs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              {t === "prefs" ? "내 조건" : "검색 로그"}
            </button>
          ))}
        </div>

        {tab === "prefs" ? (
          <div className="space-y-5">
            <Field label="피부 타입">
              <div className="flex flex-wrap gap-2">{SKIN_TYPES.map((s) => chipBtn(s, prefs.skin_type === s, () => setPrefs((p) => ({ ...p, skin_type: s }))))}</div>
            </Field>
            <Field label="톤">
              <div className="flex flex-wrap gap-2">{TONES.map((t) => chipBtn(t, prefs.tone === t, () => setPrefs((p) => ({ ...p, tone: t }))))}</div>
            </Field>
            <Field label="고민">
              <div className="flex flex-wrap gap-2">{CONCERNS.map((c) => chipBtn(c, prefs.concerns.includes(c), () => toggleConcern(c)))}</div>
            </Field>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">무향 선호</span>
              <Switch checked={prefs.fragrance_free} onCheckedChange={(v) => setPrefs((p) => ({ ...p, fragrance_free: v }))} />
            </div>
            <Field label="제외 성분">
              <div className="flex flex-wrap gap-2">{EXCLUDE.map((e) => chipBtn(e, prefs.exclude_ingredients.includes(e), () => toggleExclude(e)))}</div>
            </Field>
            <Field label="예산">
              <div className="flex flex-wrap gap-2">{BUDGETS.map((b) => chipBtn(b, prefs.budget_band === b, () => setPrefs((p) => ({ ...p, budget_band: b }))))}</div>
            </Field>
            <div className="flex gap-2">
              <Button variant="glow" className="flex-1" onClick={save}>✨ 저장</Button>
              <Button variant="outline" onClick={reset}>초기화</Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {accountData.search_logs.map((log) => (
              <div key={log.query + log.created_at} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{log.query}</p>
                  <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleDateString("ko")} · {log.result_count}개 결과</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => { logEvent("RERUN_SEARCH", { query: log.query }); navigate(`/search?q=${encodeURIComponent(log.query)}`); }}>
                  다시 보기
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
