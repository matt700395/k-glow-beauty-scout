import { Heart, Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logEvent } from "@/utils/events";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  tags?: string[];
  ingredients_caution?: string[];
  explain_short: string;
  image_url: string;
}

interface ProductCardProps {
  product: Product;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  showCheckbox?: boolean;
  checked?: boolean;
  onCheck?: (id: string) => void;
  index?: number;
}

export default function ProductCard({ product, saved, onToggleSave, showCheckbox, checked, onCheck, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate(`/auth?next=/search&intent=save`);
      return;
    }
    logEvent("SAVE_TOGGLE", { productId: product.id, action: saved ? "unsave" : "save" });
    onToggleSave?.(product.id);
  };

  const handleOpen = () => {
    logEvent("PRODUCT_OPEN", { productId: product.id });
    navigate(`/p/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-xl bg-card border border-border p-4 hover:glow-shadow transition-shadow cursor-pointer"
      onClick={handleOpen}
    >
      <div className="flex gap-3">
        {showCheckbox && (
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={checked} onCheckedChange={() => onCheck?.(product.id)} />
          </div>
        )}
        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-glow-subtle text-primary font-medium shrink-0">
              {product.category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{product.explain_short}</p>
          {product.ingredients_caution && product.ingredients_caution.length > 0 && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              주의: {product.ingredients_caution.join(", ")}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); handleOpen(); }}>
              <Eye className="w-3 h-3 mr-1" />
              상세보기
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave}>
              <Heart className={`w-3.5 h-3.5 ${saved ? "fill-current text-primary" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
