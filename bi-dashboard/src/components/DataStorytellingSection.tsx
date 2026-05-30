"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, AlertCircle, TrendingUp, Lightbulb } from "lucide-react";

const stories = [
  {
    question: "Kondisi Distribusi Data",
    icon: AlertCircle,
    color: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/25",
    bg: "from-blue-500/10",
    number: "01",
    content: [
      {
        title: "Mayoritas Frekuensi Rendah",
        body: "Sebagian besar wilayah kabupaten/kota di Jawa Barat mencatatkan jumlah kejadian banjir yang relatif rendah. Hal ini menunjukkan bahwa frekuensi banjir tinggi hanya terkonsentrasi pada wilayah tertentu.",
      },
      {
        title: "Distribusi Right-Skewed",
        body: "Analisis distribusi data memperlihatkan pola right-skewed (condong ke kanan), mengindikasikan adanya outlier di mana sebagian kecil wilayah menghasilkan volume sampah dan frekuensi banjir yang sangat ekstrem.",
      },
    ],
  },
  {
    question: "Hubungan Sampah & Banjir",
    icon: TrendingUp,
    color: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/25",
    bg: "from-violet-500/10",
    number: "02",
    content: [
      {
        title: "Korelasi Non-Linear",
        body: "Berdasarkan Exploratory Data Analysis (EDA), tidak ditemukan korelasi linear yang kuat secara langsung antara total produksi sampah dengan frekuensi kejadian banjir di berbagai wilayah.",
      },
      {
        title: "Variabilitas Karakteristik Wilayah",
        body: "Tingginya volume sampah di suatu wilayah tidak selalu berbanding lurus dengan tingginya angka banjir. Variabilitas ini sangat dipengaruhi oleh anomali geografis, infrastruktur drainase, dan tata ruang masing-masing daerah.",
      },
    ],
  },
  {
    question: "Segmentasi & Rekomendasi",
    icon: Lightbulb,
    color: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/25",
    bg: "from-amber-500/10",
    number: "03",
    content: [
      {
        title: "Karakteristik 3 Klaster (K-Means)",
        body: "Segmentasi menghasilkan Cluster 0 untuk Risiko Rendah (mendominasi), Cluster 1 untuk Risiko Sedang, dan Cluster 2 untuk Risiko Tinggi (seperti Kabupaten Bogor yang memiliki tingkat banjir tertinggi).",
      },
      {
        title: "Mitigasi Bencana Terarah",
        body: "Insight analisis ini menyarankan agar kebijakan pemerintah daerah difokuskan pada mitigasi bencana terarah dan perbaikan pengelolaan tata ruang kota berdasarkan segmentasi risiko secara objektif.",
      },
    ],
  },
];

export default function DataStorytellingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="storytelling" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100 dark:via-slate-900/40 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-5">
            <BookOpen className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 tracking-widest uppercase">
              Insight Analisis
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Insight{" "}
            <span className="gradient-text">Analisis Data</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Merangkum temuan kunci dari Exploratory Data Analysis (EDA) dan pemodelan K-Means 
            untuk mendukung pengambilan keputusan berbasis data yang objektif.
          </p>
        </motion.div>

        {/* Stories */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {stories.map((story, i) => (
            <motion.div
              key={story.question}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`glass border ${story.border} rounded-3xl p-8 shine-effect`}
            >
              {/* Question Header */}
              <div className="flex items-start gap-5 mb-6">
                <div className={`text-5xl font-black ${story.color} opacity-30 leading-none`} style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                  {story.number}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <story.icon className={`w-4 h-4 ${story.color}`} />
                    <span className={`text-xs font-black ${story.color} uppercase tracking-widest`}>
                      Data Insight
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{story.question}</h3>
                </div>
              </div>

              {/* Content Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {story.content.map((c, j) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.15 + j * 0.1 + 0.2 }}
                    className={`bg-gradient-to-br ${story.bg} to-transparent border ${story.border} rounded-2xl p-5`}
                  >
                    <h4 className={`text-sm font-bold ${story.color} mb-2`}>{c.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
