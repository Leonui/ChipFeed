import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Bot,
  Brain,
  Cpu,
  Github,
  Layers,
  Server,
  Zap,
} from "lucide-react";
import { GITHUB_KEYWORD_GROUPS } from "../../../scripts/config";

const KEYWORD_GROUP_META: Record<string, { title: string; icon: LucideIcon }> = {
  "hardware-design": { title: "Hardware Design", icon: Cpu },
  "synthesis-pnr": { title: "Synthesis & PnR", icon: Layers },
  accelerators: { title: "Accelerators", icon: Zap },
  "model-compression": { title: "Model Compression", icon: Brain },
  optimization: { title: "Optimization", icon: Activity },
  frameworks: { title: "Frameworks", icon: Server },
  "edge-ai": { title: "Edge AI", icon: Server },
  "ai-hardware": { title: "AI Hardware", icon: Cpu },
  "llm-eda": { title: "LLM & Agent EDA", icon: Bot },
};

function formatKeyword(keyword: string): string {
  const acronyms = new Set([
    "ai",
    "asic",
    "cuda",
    "dpu",
    "eda",
    "fpga",
    "hls",
    "llm",
    "mlir",
    "npu",
    "onnx",
    "rtl",
    "tpu",
    "tvm",
    "vhdl",
  ]);

  return keyword
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (acronyms.has(lower)) return lower.toUpperCase();
      if (/^llm\d*eda$/i.test(word)) return word.toUpperCase();
      if (/^[A-Z0-9]+$/.test(word) || /[A-Z].*[A-Z]/.test(word)) return word;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          About ChipFeed
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Your daily intelligence brief for hardware design, AI accelerators, and emerging silicon technologies. 
          Automated insights delivered every morning at <span className="font-mono text-indigo-600 dark:text-indigo-400">05:00 UTC</span>.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Github className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">GitHub Keywords</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(GITHUB_KEYWORD_GROUPS).map(([group, keywords]) => {
              const meta = KEYWORD_GROUP_META[group] ?? {
                title: formatKeyword(group),
                icon: Cpu,
              };
              const Icon = meta.icon;

              return (
                <KeywordCard
                  key={group}
                  icon={<Icon />}
                  title={meta.title}
                  items={keywords.map(formatKeyword)}
                />
              );
            })}
          </div>
        </section>

        <section className="space-y-8">
           <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">arXiv Categories</h2>
          </div>
          <div className="space-y-3">
            <CategoryItem code="cs.AI" label="Artificial Intelligence" />
            <CategoryItem code="cs.LG" label="Machine Learning" />
            <CategoryItem code="cs.NE" label="Neural and Evolutionary Computing" />
            <CategoryItem code="cs.DC" label="Distributed, Parallel, and Cluster Computing" />
            <CategoryItem code="cs.ET" label="Emerging Technologies" />
            <CategoryItem code="cs.AR" label="Hardware Architecture" />
            <CategoryItem code="eess.SP" label="Signal Processing" />
            <CategoryItem code="eess.SY" label="Systems and Control" />
          </div>
        </section>
      </div>
    </div>
  );
}

function KeywordCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-indigo-600 dark:text-indigo-400 [&>svg]:w-5 [&>svg]:h-5">{icon}</div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span 
            key={item} 
            className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryItem({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
      <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded min-w-[4.5rem] text-center">
        {code}
      </span>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 mt-1">
        {label}
      </span>
    </div>
  );
}
