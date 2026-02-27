import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logEvent } from "@/utils/events";

interface Filters {
  category: string;
  priceBand: string;
  fragrance: boolean;
  sensitive: boolean;
  excludeFragrance: boolean;
  excludeEthanol: boolean;
  excludeSilicone: boolean;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const update = (partial: Partial<Filters>) => {
    const next = { ...filters, ...partial };
    onChange(next);
    logEvent("FILTER_APPLY", { filters: next });
  };

  const reset = () => {
    const def: Filters = { category: "all", priceBand: "all", fragrance: false, sensitive: false, excludeFragrance: false, excludeEthanol: false, excludeSilicone: false };
    onChange(def);
    logEvent("FILTER_APPLY", { filters: def });
  };

  const chip = (label: string, active: boolean, toggle: () => void) => (
    <Button key={label} variant={active ? "default" : "chip"} size="sm" className="h-7 text-xs" onClick={toggle}>
      {label}
    </Button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.category} onValueChange={(v) => update({ category: v })}>
        <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          {[["all", "전체"], ["skincare", "스킨케어"], ["base", "베이스"], ["lip", "립"], ["eye", "아이"], ["suncare", "선케어"]].map(([v, l]) => (
            <SelectItem key={v} value={v}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.priceBand} onValueChange={(v) => update({ priceBand: v })}>
        <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          {[["all", "전체"], ["1-3만", "1-3만"], ["3-5만", "3-5만"], ["5만+", "5만+"]].map(([v, l]) => (
            <SelectItem key={v} value={v}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {chip("무향", filters.fragrance, () => update({ fragrance: !filters.fragrance }))}
      {chip("민감", filters.sensitive, () => update({ sensitive: !filters.sensitive }))}
      {chip("향료 제외", filters.excludeFragrance, () => update({ excludeFragrance: !filters.excludeFragrance }))}
      {chip("에탄올 제외", filters.excludeEthanol, () => update({ excludeEthanol: !filters.excludeEthanol }))}
      {chip("실리콘 제외", filters.excludeSilicone, () => update({ excludeSilicone: !filters.excludeSilicone }))}
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={reset}>필터 초기화</Button>
    </div>
  );
}
