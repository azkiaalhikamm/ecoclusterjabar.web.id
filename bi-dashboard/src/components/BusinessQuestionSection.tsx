"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const questions = [
  {
    id: "BQ1",
    question: "Wilayah mana saja di Jawa Barat yang memiliki tingkat risiko banjir paling tinggi?",
    context: "Analisis dilakukan terhadap data kejadian banjir historis untuk mengidentifikasi wilayah dengan tingkat kerawanan tertinggi.",
    insight: "Distribusi data tidak merata (right skewed), di mana beberapa wilayah mencatat frekuensi banjir yang jauh lebih tinggi dibandingkan wilayah lainnya.",
    color: "blue",
  },
  {
    id: "BQ2",
    question: "Bagaimana distribusi wilayah berdasarkan tingkat risiko banjir dan sampah?",
    context: "Pemetaan sebaran wilayah menggunakan metode K-Means Clustering untuk melihat pengelompokan berdasarkan volume sampah dan frekuensi banjir.",
    insight: "Clustering menghasilkan 3 kategori risiko, namun secara spesifik terdapat wilayah dengan produksi sampah tinggi dan frekuensi kejadian banjir tinggi secara bersamaan.",
    color: "violet",
  },
  {
    id: "BQ3",
    question: "Apakah terdapat hubungan antara tingginya produksi sampah dengan kejadian banjir?",
    context: "Evaluasi statistik untuk mengukur korelasi antara volume sampah dengan frekuensi kejadian banjir di tingkat kabupaten/kota.",
    insight: "Berdasarkan hasil analisis, hubungan antara produksi sampah dan kejadian banjir tergolong lemah, mengindikasikan faktor lain yang lebih dominan memicu banjir.",
    color: "cyan",
  },
  {
    id: "BQ4",
    question: "Wilayah mana yang termasuk dalam kategori prioritas penanganan lingkungan?",
    context: "Identifikasi wilayah yang memerlukan intervensi segera berdasarkan tingkat kerawanan lingkungan secara keseluruhan.",
    insight: "Wilayah risiko tinggi menjadi prioritas penanganan utama untuk mendukung efisiensi mitigasi bencana dan manajemen lingkungan dalam kerangka Smart Governance.",
    color: "amber",
  },
  {
    id: "BQ5",
    question: "Bagaimana hasil segmentasi wilayah berdasarkan metode K-Means Clustering?",
    context: "Evaluasi pembentukan klaster menggunakan machine learning unsupervised dalam membentuk segmentasi yang objektif.",
    insight: "Metode K-Means Clustering menghasilkan 3 kategori risiko secara optimal, yang menunjukkan pemisahan klaster yang valid untuk pengambilan keputusan berbasis data.",
    color: "emerald",
  },
];

const colorMap: Record<string, { badge: string; border: string; text: string; bg: string; leftBorder: string }> = {
  blue: { badge: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30", border: "border-blue-500/20 hover:border-blue-500/40", text: "text-blue-600 dark:text-blue-400", bg: "from-blue-500/5", leftBorder: "border-blue-600 dark:border-blue-400" },
  violet: { badge: "bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30", border: "border-violet-500/20 hover:border-violet-500/40", text: "text-violet-600 dark:text-violet-400", bg: "from-violet-500/5", leftBorder: "border-violet-600 dark:border-violet-400" },
  cyan: { badge: "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30", border: "border-cyan-500/20 hover:border-cyan-500/40", text: "text-cyan-600 dark:text-cyan-400", bg: "from-cyan-500/5", leftBorder: "border-cyan-600 dark:border-cyan-400" },
  amber: { badge: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30", border: "border-amber-500/20 hover:border-amber-500/40", text: "text-amber-600 dark:text-amber-400", bg: "from-amber-500/5", leftBorder: "border-amber-600 dark:border-amber-400" },
  emerald: { badge: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30", border: "border-emerald-500/20 hover:border-emerald-500/40", text: "text-emerald-600 dark:text-emerald-400", bg: "from-emerald-500/5", leftBorder: "border-emerald-600 dark:border-emerald-400" },
  red: { badge: "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30", border: "border-red-500/20 hover:border-red-500/40", text: "text-red-600 dark:text-red-400", bg: "from-red-500/5", leftBorder: "border-red-600 dark:border-red-400" },
};

function BQCard({ q, index, inView }: { q: typeof questions[0]; index: number; inView: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const c = colorMap[q.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`glass border ${c.border} rounded-2xl overflow-hidden transition-all duration-300`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 flex items-start gap-4 group"
      >
        {/* Badge */}
        <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg border text-xs font-black tracking-widest ${c.badge}`}>
          {q.id}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {q.question}
          </p>
        </div>

        {/* Expand Icon */}
        <ChevronDown
          className={`w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded Content */}
      <motion.div
        initial={false}
        animate={expanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className={`px-6 pb-6 pt-2 bg-gradient-to-b ${c.bg} to-transparent space-y-4`}>
          <div className="pl-4 border-l-2 border-slate-300 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Konteks Analisis</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{q.context}</p>
          </div>
          <div className={`pl-4 border-l-2 ${c.leftBorder}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${c.text}`}>Insight Analisis</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{q.insight}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BusinessQuestionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="business-questions" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50 dark:via-blue-950/10 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-300 tracking-widest uppercase">
              Business Questions
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Pertanyaan{" "}
            <span className="gradient-text">Bisnis Utama</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Pertanyaan bisnis digunakan untuk mengarahkan proses analisis data dan mendukung pengambilan keputusan berbasis data dalam pengelolaan banjir dan sampah di Provinsi Jawa Barat.
          </p>
        </motion.div>

        {/* Questions */}
        <div className="max-w-4xl mx-auto space-y-4">
          {questions.map((q, i) => (
            <BQCard key={q.id} q={q} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
