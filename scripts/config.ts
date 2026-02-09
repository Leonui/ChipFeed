// ---------------------
// GitHub Search Config
// ---------------------

export const GITHUB_KEYWORD_GROUPS: Record<string, string[]> = {
  "hardware-design": [
    "FPGA", "ASIC", "RTL", "Verilog", "SystemVerilog",
    "VHDL", "hardware-description-language", "chisel-lang",
  ],
  "synthesis-pnr": [
    "logic-synthesis", "place-and-route", "EDA",
    "electronic-design-automation", "OpenROAD", "yosys",
  ],
  "accelerators": [
    "AI-accelerator", "neural-network-accelerator", "TPU",
    "NPU", "hardware-accelerator", "DPU",
  ],
  "model-compression": [
    "model-compression", "quantization", "pruning",
    "knowledge-distillation", "neural-architecture-search",
  ],
  "optimization": [
    "HLS", "high-level-synthesis", "hardware-optimization",
    "CUDA-optimization", "kernel-optimization",
  ],
  "frameworks": [
    "TVM", "MLIR", "ONNX-runtime",
    "TensorRT", "OpenVINO", "triton-lang",
  ],
  "edge-ai": [
    "edge-AI", "TinyML", "embedded-ML",
    "microcontroller-AI", "on-device-inference",
  ],
  "ai-hardware": [
    "neuromorphic", "in-memory-computing", "photonic-computing",
    "analog-computing", "compute-in-memory",
  ],
};

// --------------------
// arXiv Search Config
// --------------------

export const ARXIV_CATEGORIES = [
  "cs.AI",
  "cs.LG",
  "cs.NE",
  "cs.DC",
  "cs.ET",
  "cs.AR",
  "eess.SP",
  "eess.SY",
];

export const ARXIV_KEYWORD_GROUPS: Record<string, string[]> = {
  "hardware-design": [
    "FPGA", "ASIC", "RTL", "Verilog", "SystemVerilog",
    "VHDL", "hardware description language",
  ],
  "synthesis-pnr": [
    "logic synthesis", "place and route", "EDA",
    "electronic design automation", "physical design",
  ],
  "accelerators": [
    "neural network accelerator", "hardware accelerator",
    "AI accelerator", "TPU", "NPU", "DPU",
    "systolic array", "dataflow architecture",
  ],
  "model-compression": [
    "model compression", "quantization", "pruning",
    "knowledge distillation", "neural architecture search",
    "mixed precision", "weight sharing",
  ],
  "optimization": [
    "high level synthesis", "hardware optimization",
    "CUDA", "kernel optimization", "operator fusion",
    "graph compiler", "loop tiling",
  ],
  "frameworks": [
    "TVM", "MLIR", "ONNX", "TensorRT",
    "OpenVINO", "Triton", "compiler infrastructure",
  ],
  "edge-ai": [
    "edge AI", "TinyML", "embedded machine learning",
    "on-device inference", "edge inference",
    "microcontroller", "IoT machine learning",
  ],
  "ai-hardware": [
    "neuromorphic", "in-memory computing", "photonic computing",
    "analog computing", "compute-in-memory",
    "processing-in-memory", "memristor",
  ],
};

// ---------------------
// Shared Constants
// ---------------------

// Delay between API requests to stay within rate limits (arXiv requires >3s)
export const REQUEST_DELAY_MS = 3500;
// Max pages to paginate per GitHub keyword group
export const GITHUB_MAX_PAGES = 1;
// Number of results per page from GitHub Search API (max 100)
export const GITHUB_PER_PAGE = 20;
// Max papers to fetch from arXiv in a single query
export const ARXIV_MAX_RESULTS = 100;
// Auto-prune daily JSON files older than this many days
export const DATA_RETENTION_DAYS = 90;
