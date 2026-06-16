import { CheckCircle2 } from "lucide-react";

export default function RoadmapList({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-mint/10 text-mint">
            <CheckCircle2 size={15} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Step {index + 1}</div>
            <div className="text-sm text-slate-200">{item}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
