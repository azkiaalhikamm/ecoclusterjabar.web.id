"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Database,
  Globe,
  TrendingUp,
  Zap,
} from "lucide-react";

const badges = [
  { icon: Brain, label: "K-Means Clustering", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: Database, label: "ETL Pipeline", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Globe, label: "Smart City BI", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { icon: TrendingUp, label: "Data-Driven", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

const stats = [
  { value: "27", label: "Kab/Kota", suffix: "" },
  { value: "3", label: "Cluster Risk", suffix: "" },
  { value: "5+", label: "Tahun Data", suffix: "" },
  { value: "98.2", label: "Silhouette Score", suffix: "%" },
];

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg-dark" />
      <div className="absolute inset-0 noise-bg opacity-40" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 hero-grid-pattern pointer-events-none"
      />

      {/* Glow orbs */}
      <motion.div
        style={{ y }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-glow-pulse pointer-events-none"
      />
      <motion.div
        style={{ y: y2, animationDelay: "1.5s" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] animate-glow-pulse pointer-events-none"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container-custom text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 tracking-widest uppercase">
            Business Intelligence Platform · Smart City Jawa Barat
          </span>
          <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-plus-jakarta)" }}
        >
          <span className="text-slate-900 dark:text-white">Dashboard BI untuk</span>
          <br />
          <span className="gradient-text">Analisis & Klasterisasi</span>
          <br />
          <span className="text-slate-900 dark:text-white">Wilayah Jawa Barat</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4 font-medium"
        >
          Platform <span className="text-slate-800 dark:text-slate-200">Business Intelligence</span> berbasis{" "}
          <span className="text-blue-600 dark:text-blue-400">Smart City</span> untuk menganalisis dan mengelompokkan
          27 kabupaten/kota di Jawa Barat berdasarkan{" "}
          <span className="text-cyan-600 dark:text-cyan-400">tingkat kejadian banjir</span> dan{" "}
          <span className="text-emerald-600 dark:text-emerald-400">jumlah produksi sampah</span> menggunakan{" "}
          <span className="text-violet-600 dark:text-violet-400">K-Means Clustering</span>.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-sm text-slate-600 dark:text-slate-500 mb-10 font-medium"
        >
          Business Intelligence · Semester 6 · 2025/2026
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link
            href="#dashboard"
            className="group flex items-center gap-2.5 px-7 py-3.5 gradient-bg-primary text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            View Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#clustering"
            className="flex items-center gap-2.5 px-7 py-3.5 glass text-slate-700 dark:text-slate-200 font-semibold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-sm hover:-translate-y-1 border border-slate-200 dark:border-white/10"
          >
            <Brain className="w-4 h-4" />
            Explore Analysis
          </Link>
        </motion.div>

        {/* Tech Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${badge.bg} text-xs font-semibold tracking-wide`}
            >
              <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
              <span className={badge.color}>{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="glass border border-slate-200 dark:border-white/8 rounded-2xl p-4 text-center card-glow"
            >
              <div className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                {stat.value}
                <span className="text-base">{stat.suffix}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-600 dark:text-slate-600 font-medium tracking-widest uppercase">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-5 h-8 rounded-full border border-slate-400 dark:border-slate-700 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-blue-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
