import { Cpu, BookOpen, Layers, Zap, Brain, Activity, Share2, Server } from "lucide-react";

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
              <GithubIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">GitHub Keywords</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <KeywordCard 
              icon={<Cpu />} 
              title="Hardware Design" 
              items={["FPGA", "ASIC", "RTL", "Verilog", "SystemVerilog", "VHDL", "Chisel"]} 
            />
            <KeywordCard 
              icon={<Layers />} 
              title="Synthesis & PnR" 
              items={["Logic synthesis", "Place-and-route", "EDA", "OpenROAD", "Yosys"]} 
            />
            <KeywordCard 
              icon={<Zap />} 
              title="Accelerators" 
              items={["AI accelerator", "Neural network accelerator", "TPU", "NPU", "DPU"]} 
            />
            <KeywordCard 
              icon={<Brain />} 
              title="Model Compression" 
              items={["Quantization", "Pruning", "Knowledge distillation", "NAS"]} 
            />
             <KeywordCard 
              icon={<Activity />} 
              title="Optimization" 
              items={["HLS", "High-level synthesis", "CUDA optimization"]} 
            />
            <KeywordCard 
              icon={<Server />} 
              title="Edge AI & Hardware" 
              items={["TinyML", "Neuromorphic", "In-memory computing"]} 
            />
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

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
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
