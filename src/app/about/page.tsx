export default function AboutPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>About ChipFeed</h1>
      <p>
        ChipFeed is a daily news aggregator for hardware design, AI accelerators,
        and related topics. It automatically fetches trending GitHub repositories
        and new arXiv papers every day at 06:35 UTC.
      </p>

      <h2>Tracked GitHub Keywords</h2>
      <ul>
        <li><strong>Hardware Design:</strong> FPGA, ASIC, RTL, Verilog, SystemVerilog, VHDL, Chisel</li>
        <li><strong>Synthesis &amp; PnR:</strong> Logic synthesis, Place-and-route, EDA, OpenROAD, Yosys</li>
        <li><strong>Accelerators:</strong> AI accelerator, Neural network accelerator, TPU, NPU, DPU</li>
        <li><strong>Model Compression:</strong> Quantization, Pruning, Knowledge distillation, NAS</li>
        <li><strong>Optimization:</strong> HLS, High-level synthesis, CUDA optimization</li>
        <li><strong>Frameworks:</strong> TVM, MLIR, ONNX Runtime, TensorRT, OpenVINO, Triton</li>
        <li><strong>Edge AI:</strong> TinyML, Embedded ML, On-device inference</li>
        <li><strong>AI Hardware:</strong> Neuromorphic, In-memory computing, Photonic computing</li>
      </ul>

      <h2>Tracked arXiv Categories</h2>
      <ul>
        <li>cs.AI — Artificial Intelligence</li>
        <li>cs.LG — Machine Learning</li>
        <li>cs.NE — Neural and Evolutionary Computing</li>
        <li>cs.DC — Distributed, Parallel, and Cluster Computing</li>
        <li>cs.ET — Emerging Technologies</li>
        <li>cs.AR — Hardware Architecture</li>
        <li>eess.SP — Signal Processing</li>
        <li>eess.SY — Systems and Control</li>
      </ul>
    </div>
  );
}
