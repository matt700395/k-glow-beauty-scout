import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price_band: string;
  finish: string;
  tone_fit: string;
  ingredients_top: string[];
  ingredients_caution: string[];
  explain_short: string;
}

interface CompareModalProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

const ROWS: { label: string; key: keyof Product | "ingredients" | "caution" }[] = [
  { label: "브랜드", key: "brand" },
  { label: "카테고리", key: "category" },
  { label: "가격대", key: "price_band" },
  { label: "마무리감", key: "finish" },
  { label: "톤", key: "tone_fit" },
  { label: "핵심 성분", key: "ingredients" },
  { label: "주의 성분", key: "caution" },
  { label: "추천 이유", key: "explain_short" },
];

export default function CompareModal({ open, onClose, products }: CompareModalProps) {
  const getValue = (p: Product, key: string) => {
    if (key === "ingredients") return p.ingredients_top.join(", ") || "-";
    if (key === "caution") return p.ingredients_caution.length > 0 ? p.ingredients_caution.join(", ") : "없음";
    return String((p as any)[key] || "-");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>제품 비교</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-medium text-muted-foreground w-20">항목</th>
                {products.map((p) => (
                  <th key={p.id} className="p-2 text-left font-semibold">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-border/50">
                  <td className="p-2 text-muted-foreground font-medium">{row.label}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-2">{getValue(p, row.key)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
