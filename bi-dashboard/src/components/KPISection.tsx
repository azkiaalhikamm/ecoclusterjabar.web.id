"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Activity,
  BarChart2,
  Droplets,
  Map,
  Percent,
  Recycle,
  TrendingUp,
  Users,
} from "lucide-react";

const kpis = [
  {
    icon: Droplets,
    value: 892,
    suffix: "",
    label: "Total Kejadian Banjir",
    description: "Menampilkan total agregasi kejadian banjir dari dataset.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
    trend: "Data Historis",
    trendUp: true,
  },
  {
    icon: Recycle,
    value: 5834,
    suffix: " ton",
    label: "Rata-rata Volume Sampah",
    description: "Menampilkan volume rata-rata produksi sampah (ribu ton/tahun).",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    trend: "Produksi Sampah",
    trendUp: true,
  },
  {
    icon: Map,
    value: 3,
    suffix: "",
    label: "Jumlah Cluster Risiko",
    description: "3 Cluster Risiko (Rendah, Sedang, Tinggi).",
    color: "text-violet-600 dark:text-violet-400",
    bg: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
    trend: "K-Means Clustering",
    trendUp: true,
  },
  {
    icon: Percent,
    value: 33,
    suffix: "%",
    label: "Persentase Wilayah Risiko Tinggi",
    description: "Menampilkan persentase wilayah yang masuk cluster risiko tinggi.",
    color: "text-red-600 dark:text-red-400",
    bg: "from-red-500/20 to-red-600/10",
    border: "border-red-500/30",
    glow: "shadow-red-500/20",
    trend: "Cluster Risiko Tinggi",
    trendUp: false,
  },
  {
    icon: TrendingUp,
    value: 9,
    suffix: " Tahun",
    label: "Rentang Data",
    description: "Data historis analisis dari tahun 2015 sampai dengan 2023.",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/20",
    trend: "Periode 2015–2023",
    trendUp: true,
  },
  {
    icon: Activity,
    value: 70.7,
    suffix: "%",
    label: "Silhouette Score",
    description: "Metrik evaluasi untuk mengukur validitas model K-Means.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    trend: "Evaluasi Clustering",
    trendUp: true,
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {Number.isInteger(target) ? count.toFixed(0) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function KPISection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="kpi" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100 dark:via-slate-900/50 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-5">
            <BarChart2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 tracking-widest uppercase">
              Key Performance Indicators
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Metrik Utama{" "}
            <span className="gradient-text">Analisis Data</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Metrik utama digunakan untuk menggambarkan kondisi banjir, volume sampah, hasil clustering, dan kualitas model analisis data di Provinsi Jawa Barat.
          </p>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative glass border ${kpi.border} rounded-3xl p-7 shadow-xl ${kpi.glow} transition-all duration-300 overflow-hidden group`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.bg} border ${kpi.border} flex items-center justify-center mb-5`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>

                {/* Value */}
                <div
                  className={`text-3xl sm:text-4xl font-black ${kpi.color} mb-2`}
                  style={{ fontFamily: "var(--font-plus-jakarta)" }}
                >
                  <AnimatedCounter target={kpi.value} suffix={kpi.suffix} />
                </div>

                {/* Label */}
                <div className="text-base font-bold text-slate-900 dark:text-white mb-2">{kpi.label}</div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{kpi.description}</p>

                {/* Trend */}
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${kpi.trendUp ? "text-emerald-400" : "text-red-400"}`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${!kpi.trendUp && "rotate-180"}`} />
                  {kpi.trend}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
