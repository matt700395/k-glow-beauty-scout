import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logEvent } from "@/utils/events";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  source: string;
  sourceId?: string;
}

const FEATURES = [
  "AM/PM 맞춤 루틴 구성",
  "성분 조합 시너지 분석",
  "주의 조합 경고",
  "대체 제품 추천",
];

export default function PaymentModal({ open, onClose, source, sourceId }: PaymentModalProps) {
  const navigate = useNavigate();

  const handlePay = () => {
    logEvent("PAYMENT_START", { source, sourceId });
    onClose();
    navigate("/report/rpt_001");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            프리미엄 루틴 리포트
          </DialogTitle>
          <DialogDescription>
            AI가 맞춤 AM/PM 루틴, 주의 조합, 대체 제품을 분석합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg gradient-glow-subtle p-4 space-y-2">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">₩4,900</p>
          </div>
          <Button variant="glow" className="w-full" onClick={handlePay}>
            결제 완료 (더미)
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            데모 환경에서는 실제 결제가 발생하지 않습니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
