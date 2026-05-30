"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BarChart2,
  Brain,
  Database,
  FileSearch,
  GitMerge,
  Layout,
  Layers,
  Search,
  CheckCircle2,
} from "lucide-react";

const weeks = [
  {
    week: "Week 1",
    title: "Business Understanding",
    status: "completed",
    color: "blue",
    icon: Search,
    tasks: [
      { label: "Business Understanding", done: true },
      { label: "KPI Definition", done: true },
      { label: "Business Questions", done: true },
      { label: "Dataset Selection", done: true },
    ],
    description:
      "Pemahaman mendalam tentang konteks bisnis, penetapan KPI, formulasi pertanyaan bisnis, dan pemilihan dataset yang relevan dari Open Data Jawa Barat.",
  },
  {
    week: "Week 2",
    title: "Exploratory Data Analysis",
    status: "completed",
    color: "violet",
    icon: FileSearch,
    tasks: [
      { label: "Statistical Analysis", done: true },
      { label: "Data Visualization", done: true },
      { label: "Distribution Analysis", done: true },
      { label: "Initial Insights", done: true },
    ],
    description:
      "Eksplorasi mendalam data banjir dan sampah melalui analisis statistik deskriptif, visualisasi distribusi, dan identifikasi pola awal.",
  },
  {
    week: "Week 3",
    title: "ETL & Data Warehouse",
    status: "completed",
    color: "cyan",
    icon: Database,
    tasks: [
      { label: "ETL Pipeline", done: true },
      { label: "Data Cleaning", done: true },
      { label: "Star Schema Design", done: true },
      { label: "Fact & Dimension Tables", done: true },
    ],
    description:
      "Pembangunan pipeline ETL, pembersihan data, integrasi multi-source, dan perancangan skema Data Warehouse dengan model dimensional Star Schema.",
  },
  {
    week: "Week 4",
    title: "K-Means Clustering",
    status: "completed",
    color: "amber",
    icon: Brain,
    tasks: [
      { label: "Model Training", done: true },
      { label: "Elbow Method", done: true },
      { label: "Silhouette Analysis", done: true },
      { label: "Cluster Interpretation", done: true },
    ],
    description:
      "Implementasi algoritma K-Means, optimasi hyperparameter menggunakan Elbow Method, validasi dengan Silhouette Score, dan interpretasi hasil cluster.",
  },
  {
    week: "Week 5",
    title: "Dashboard & Insights",
    status: "completed",
    color: "emerald",
    icon: Layout,
    tasks: [
      { label: "BI Dashboard", done: true },
      { label: "Data Storytelling", done: true },
      { label: "Decision Making", done: true },
      { label: "Policy Recommendations", done: true },
    ],
    description:
      "Pembangunan dashboard BI interaktif, narasi data storytelling berbasis cluster, dan perumusan rekomendasi kebijakan berbasis data untuk stakeholder.",
  },
];

const colorConfig: Record<string, {
  badge: string; border: string; text: string; bg: string;
  line: string; dot: string; dotGlow: string; taskDot: string
}> = {
  blue: {
    badge: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
    border: "border-blue-500/30 hover:border-blue-500/50",
    text: "text-blue-600 dark:text-blue-400", bg: "from-blue-500/10 to-transparent",
    line: "bg-blue-500", dot: "bg-blue-500", dotGlow: "shadow-blue-500/50",
    taskDot: "bg-blue-500/30 border-blue-500/50",
  },
  violet: {
    badge: "bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30",
    border: "border-violet-500/30 hover:border-violet-500/50",
    text: "text-violet-600 dark:text-violet-400", bg: "from-violet-500/10 to-transparent",
    line: "bg-violet-500", dot: "bg-violet-500", dotGlow: "shadow-violet-500/50",
    taskDot: "bg-violet-500/30 border-violet-500/50",
  },
  cyan: {
    badge: "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    border: "border-cyan-500/30 hover:border-cyan-500/50",
    text: "text-cyan-600 dark:text-cyan-400", bg: "from-cyan-500/10 to-transparent",
    line: "bg-cyan-500", dot: "bg-cyan-500", dotGlow: "shadow-cyan-500/50",
    taskDot: "bg-cyan-500/30 border-cyan-500/50",
  },
  amber: {
    badge: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
    border: "border-amber-500/30 hover:border-amber-500/50",
    text: "text-amber-600 dark:text-amber-400", bg: "from-amber-500/10 to-transparent",
    line: "bg-amber-500", dot: "bg-amber-500", dotGlow: "shadow-amber-500/50",
    taskDot: "bg-amber-500/30 border-amber-500/50",
  },
  emerald: {
    badge: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    text: "text-emerald-600 dark:text-emerald-400", bg: "from-emerald-500/10 to-transparent",
    line: "bg-emerald-500", dot: "bg-emerald-500", dotGlow: "shadow-emerald-500/50",
    taskDot: "bg-emerald-500/30 border-emerald-500/50",
  },
};

export default function TimelineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="timeline" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-200/50 dark:via-slate-900/30 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-5">
            <GitMerge className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 tracking-widest uppercase">
              Project Roadmap
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Timeline{" "}
            <span className="gradient-text">Progress Project</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Roadmap pengerjaan proyek selama 5 minggu mencakup seluruh tahapan
            Business Intelligence dari pemahaman bisnis hingga delivery dashboard.
          </p>
        </motion.div>

        {/* Progress bar overall */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
            <span>Project Progress</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-semibold">100% Complete</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : {}}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 via-cyan-500 via-amber-500 to-emerald-500"
            />
          </div>
          <div className="flex justify-between mt-2">
            {["W1", "W2", "W3", "W4", "W5"].map((w) => (
              <span key={w} className="text-xs text-slate-500 dark:text-slate-600 font-medium">{w}</span>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/30 via-cyan-500/30 via-amber-500/30 to-emerald-500/50" />

          <div className="space-y-8">
            {weeks.map((week, i) => {
              const c = colorConfig[week.color];
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`relative flex items-start ${
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 pl-16 lg:pl-0`}
                >
                  {/* Dot */}
                  <div className={`absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-6 w-5 h-5 rounded-full ${c.dot} shadow-lg ${c.dotGlow} flex items-center justify-center z-10`}>
                    <div className="w-2 h-2 rounded-full bg-white/80" />
                  </div>

                  {/* Card */}
                  <div className={`${isLeft ? "lg:pr-12 lg:text-right" : "lg:pl-12"} lg:w-1/2`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={`glass border ${c.border} rounded-2xl p-6 transition-all duration-300`}
                    >
                      {/* Header */}
                      <div className={`flex items-center gap-3 mb-4 ${isLeft ? "lg:flex-row-reverse" : ""}`}>
                        <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0`}>
                          <week.icon className={`w-4.5 h-4.5 ${c.text}`} />
                        </div>
                        <div>
                          <span className={`text-xs font-black ${c.text} tracking-widest uppercase`}>
                            {week.week}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{week.title}</h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-xs text-slate-600 dark:text-slate-500 leading-relaxed mb-4 ${isLeft ? "lg:text-right" : ""}`}>
                        {week.description}
                      </p>

                      {/* Tasks */}
                      <div className={`grid grid-cols-2 gap-2`}>
                        {week.tasks.map((task) => (
                          <div
                            key={task.label}
                            className={`flex items-center gap-2 ${isLeft ? "lg:flex-row-reverse" : ""}`}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${c.text} flex-shrink-0`} />
                            <span className="text-xs text-slate-700 dark:text-slate-400 leading-tight">{task.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
