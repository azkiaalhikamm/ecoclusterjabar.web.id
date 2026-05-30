"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, MapPin, Shield, Zap } from "lucide-react";

const decisions = [
  {
    priority: "C0",
    title: "Wilayah Risiko Rendah",
    description: "Merupakan wilayah yang relatif aman dari ancaman banjir ekstrem dan timbulan sampah sangat tinggi. Memerlukan pemantauan rutin dan monitoring kondisi lingkungan secara berkala untuk menjaga stabilitas.",
    impact: "Monitoring Rutin",
    timeline: "Cluster 0",
    color: "emerald",
  },
  {
    priority: "C1",
    title: "Wilayah Risiko Sedang",
    description: "Wilayah dengan tingkat kerawanan menengah. Fokus utama adalah pada peningkatan pengelolaan sampah, pengawasan produksi sampah, serta peningkatan kebersihan lingkungan untuk mencegah eskalasi risiko.",
    impact: "Pengawasan Sampah",
    timeline: "Cluster 1",
    color: "amber",
  },
  {
    priority: "C2",
    title: "Wilayah Risiko Tinggi",
    description: "Menjadi prioritas utama penanganan banjir dari pemerintah. Memerlukan mitigasi lingkungan lebih lanjut serta membutuhkan perhatian khusus dalam pengelolaan infrastruktur drainase dan tata kelola sampah.",
    impact: "Prioritas Mitigasi",
    timeline: "Cluster 2",
    color: "red",
  },
  {
    priority: "BI",
    title: "Identifikasi Prioritas via Clustering",
    description: "Metode K-Means Clustering membantu identifikasi wilayah prioritas secara objektif tanpa bias subjektif, memisahkan wilayah ke dalam segmen kerawanan yang berbeda untuk intervensi spesifik.",
    impact: "Objektivitas Data",
    timeline: "Metodologi",
    color: "blue",
  },
  {
    priority: "SC",
    title: "Mendukung Konsep Smart City",
    description: "Visualisasi data dan dashboard interaktif ini mendukung perwujudan Smart Environment dan Smart Governance melalui pengambilan keputusan berbasis data (data-driven decision making).",
    impact: "Smart Governance",
    timeline: "Platform BI",
    color: "violet",
  },
];

const colorMap: Record<string, { text: string; border: string; bg: string; badge: string; dot: string }> = {
  red: {
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    bg: "from-red-500/10",
    badge: "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
    dot: "bg-red-500",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    bg: "from-amber-500/10",
    badge: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
    dot: "bg-amber-500",
  },
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    bg: "from-blue-500/10",
    badge: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
    dot: "bg-blue-500",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/30",
    bg: "from-violet-500/10",
    badge: "bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30",
    dot: "bg-violet-500",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    bg: "from-emerald-500/10",
    badge: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
};

const priorityRegions = [
  { index: "C2", name: "Kabupaten Bogor", cluster: "Risiko Tinggi", color: "red" },
  { index: "C2", name: "Kota Bandung", cluster: "Risiko Tinggi", color: "red" },
  { index: "C2", name: "Kabupaten Bekasi", cluster: "Risiko Tinggi", color: "red" },
  { index: "C1", name: "Kota Depok", cluster: "Risiko Sedang", color: "amber" },
  { index: "C1", name: "Kabupaten Cirebon", cluster: "Risiko Sedang", color: "amber" },
  { index: "C0", name: "Kabupaten Majalengka", cluster: "Risiko Rendah", color: "emerald" },
  { index: "C0", name: "Kota Banjar", cluster: "Risiko Rendah", color: "emerald" },
];

export default function DecisionMakingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="decision" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50 dark:via-blue-950/5 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-5">
            <Target className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 tracking-widest uppercase">
              Interpretasi Hasil Clustering
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Rekomendasi Berdasarkan{" "}
            <span className="gradient-text">Hasil Analisis</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Rekomendasi dan interpretasi hasil digunakan untuk mendukung pengambilan 
            keputusan berbasis data dalam pengelolaan banjir dan sampah di Provinsi Jawa Barat.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left - Decision Cards */}
          <div className="space-y-4">
            {decisions.map((d, i) => {
              const c = colorMap[d.color];
              return (
                <motion.div
                  key={d.priority}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className={`glass border ${c.border} rounded-2xl p-5 transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${c.badge} border flex items-center justify-center`}>
                      <span className={`text-xs font-black ${c.text}`}>{d.priority}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{d.title}</h4>
                        <div className="flex-shrink-0 flex gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-lg ${c.badge} border whitespace-nowrap`}>
                            {d.timeline}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed mb-2">{d.description}</p>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${c.text}`}>
                        <Zap className="w-3 h-3" />
                        {d.impact}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right - Priority Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="sticky top-24"
          >
            {/* Priority Table */}
            <div className="glass border border-slate-200 dark:border-white/10 rounded-3xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Contoh Representasi Klaster</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Karakteristik wilayah berdasarkan hasil clustering</p>
                </div>
              </div>

              <div className="space-y-3">
                {priorityRegions.map((region, i) => {
                  const c = colorMap[region.color];
                  return (
                    <motion.div
                      key={region.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.07 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs font-black text-slate-500 dark:text-slate-600 w-5 text-right">{region.index}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{region.name}</span>
                          <span className={`text-xs px-2 py-1 rounded border ${c.badge}`}>
                            {region.cluster}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mitigation Strategy Summary */}
            <div className="glass border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Manfaat Analisis BI</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Data-Driven Decision", items: "Pengambilan keputusan didasarkan pada fakta data objektif." },
                  { label: "Smart Environment", items: "Mendukung pemantauan dan keberlanjutan lingkungan hidup." },
                  { label: "Smart Governance", items: "Peningkatan tata kelola pemerintahan berbasis teknologi informasi." },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/15">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">{s.label}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-500">{s.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
