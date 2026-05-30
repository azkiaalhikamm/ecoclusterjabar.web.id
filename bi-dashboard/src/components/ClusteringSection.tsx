"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ZAxis,
} from "recharts";
import {
  CLUSTER_COUNTS,
  CLUSTER_CENTROIDS,
  CLUSTER_STYLE,
  MODEL_METRICS,
  getByCluster,
} from "@/lib/clusterConstants";

// ── Tooltip scatter plot ──────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div
        className="chart-tooltip"
        style={{
          borderRadius: 12,
          padding: "10px 14px",
          minWidth: 190,
        }}
      >
        <p className="chart-tooltip-title" style={{ fontWeight: 700, fontSize: 12, marginBottom: 6 }}>
          {d.name
            .replace("KABUPATEN ", "Kab. ")
            .replace("KOTA ", "Kota ")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <p className="chart-tooltip-label" style={{ fontSize: 11 }}>
            Volume Sampah:{" "}
            <span style={{ color: "#10b981", fontWeight: 600 }}>
              {d.x >= 1000 ? `${(d.x / 1000).toFixed(0)}k` : d.x.toFixed(0)} ton
            </span>
          </p>
          <p className="chart-tooltip-label" style={{ fontSize: 11 }}>
            Kejadian Banjir:{" "}
            <span style={{ color: "#3b82f6", fontWeight: 600 }}>{d.y} kejadian</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// ── Cluster card metadata ────────────────────────────────────────────────────
const CLUSTER_CARDS = [
  {
    ...CLUSTER_STYLE[2],
    desc: "Wilayah dengan frekuensi banjir dan volume sampah tertinggi yang menjadi prioritas utama penanganan lingkungan dan mitigasi bencana.",
  },
  {
    ...CLUSTER_STYLE[1],
    desc: "Wilayah dengan tingkat risiko moderat yang memerlukan peningkatan kapasitas pengelolaan lingkungan dan program preventif berkala.",
  },
  {
    ...CLUSTER_STYLE[0],
    desc: "Wilayah dengan kondisi lingkungan relatif terkendali. Fokus pada pemeliharaan kapasitas dan pemantauan rutin.",
  },
];

/**
 * Scatter data dari clusterConstants — nilai sampah dinormalisasi ke ribuan ton
 * agar axis X terbaca (misal: 1.000 = 1k ton, bukan 1.000.000).
 */
const toScatterPts = (c: 0 | 1 | 2) =>
  getByCluster(c).map((r) => ({
    x: Math.round(r.sampah / 1000),   // ribuan ton
    y: r.banjir,                       // kejadian (absolut)
    name: r.nama,
  }));

const SCATTER_DATA = {
  tinggi: toScatterPts(2),
  sedang: toScatterPts(1),
  rendah: toScatterPts(0),
};

export default function ClusteringSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Scatter data selalu dari canonical constants (hasil_cluster.csv)
  const scatter = SCATTER_DATA;

  return (
    <section id="clustering" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-5">
            <Brain className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-300 tracking-widest uppercase">
              Machine Learning · Unsupervised Learning
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            K-Means{" "}
            <span className="gradient-text">Clustering Analysis</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Implementasi algoritma K-Means Clustering untuk mengelompokkan 27 kabupaten/kota
            di Provinsi Jawa Barat ke dalam 3 klaster risiko berdasarkan frekuensi banjir
            dan volume timbulan sampah periode 2015–2023.
          </p>
        </motion.div>

        {/* ── Model Metrics ── */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Algorithm",
              value: MODEL_METRICS.algorithm.split(" ")[0],
              description: `Unsupervised learning · k=${MODEL_METRICS.k} · random_state=${MODEL_METRICS.randomState}`,
              color: "text-violet-600 dark:text-violet-400",
              border: "border-violet-500/25",
            },
            {
              label: "Optimal k",
              value: `${MODEL_METRICS.k} Klaster`,
              description: "Risiko Rendah · Risiko Sedang · Risiko Tinggi",
              color: "text-blue-600 dark:text-blue-400",
              border: "border-blue-500/25",
            },
            {
              label: "Silhouette Score",
              value: MODEL_METRICS.silhouetteScore.toFixed(3),
              description: `Kualitas clustering: ${MODEL_METRICS.silhouetteGrade}`,
              color: "text-emerald-600 dark:text-emerald-400",
              border: "border-emerald-500/25",
            },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className={`glass border ${metric.border} rounded-2xl p-6 text-center shine-effect`}
            >
              <div
                className={`text-3xl font-black ${metric.color} mb-2`}
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {metric.value}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {metric.label}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Cluster Distribution Summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          className="glass border border-slate-200 dark:border-white/8 rounded-2xl p-5 mb-10 flex flex-wrap gap-6 items-center justify-between"
        >
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest font-semibold mb-1">
              Distribusi Klaster Wilayah
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Total <span className="text-slate-900 dark:text-white font-bold">{CLUSTER_COUNTS.total} wilayah</span>{" "}
              Provinsi Jawa Barat · Periode {MODEL_METRICS.period}
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            {CLUSTER_CARDS.map((c) => (
              <div key={c.cluster} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                <span className={`text-sm font-bold ${c.textClass}`}>
                  {c.cluster === 2 ? CLUSTER_COUNTS.tinggi
                   : c.cluster === 1 ? CLUSTER_COUNTS.sedang
                   : CLUSTER_COUNTS.rendah}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-500">{c.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Scatter Plot ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="glass border border-slate-200 dark:border-white/8 rounded-3xl p-8 mb-12 card-glow"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Visualisasi Cluster — Scatter Plot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Volume Sampah Kumulatif (X) vs Total Kejadian Banjir (Y) · 2015–2023
              </p>
            </div>
            <div className="flex items-center gap-4">
              {CLUSTER_CARDS.map((c) => (
                <div key={c.cluster} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                <XAxis
                  dataKey="x"
                  type="number"
                  name="Sampah"
                  className="chart-axis"
                  tickFormatter={(v) => `${v}k`}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Volume Sampah (Ribu Ton · Kumulatif 2015–2023)",
                    position: "insideBottom",
                    offset: -25,
                    fontSize: 11,
                    className: "chart-axis-label",
                  }}
                  domain={["auto", "auto"]}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  name="Banjir"
                  className="chart-axis"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Kejadian Banjir (Total)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 11,
                    className: "chart-axis-label",
                  }}
                  domain={[0, "auto"]}
                />
                <ZAxis range={[80, 80]} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "rgba(100,116,139,0.3)", strokeWidth: 1 }}
                />
                <Scatter
                  name="Risiko Tinggi"
                  data={scatter.tinggi}
                  fill="#ef4444"
                  fillOpacity={0.9}
                  stroke="#fca5a5"
                  strokeWidth={1}
                />
                <Scatter
                  name="Risiko Sedang"
                  data={scatter.sedang}
                  fill="#f59e0b"
                  fillOpacity={0.9}
                  stroke="#fcd34d"
                  strokeWidth={1}
                />
                <Scatter
                  name="Risiko Rendah"
                  data={scatter.rendah}
                  fill="#10b981"
                  fillOpacity={0.85}
                  stroke="#6ee7b7"
                  strokeWidth={1}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── Cluster Cards ── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {CLUSTER_CARDS.map((c, i) => {
            const regions = getByCluster(c.cluster);
            const centroid = CLUSTER_CENTROIDS[c.cluster];
            const count = regions.length;

            return (
              <motion.div
                key={c.cluster}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`glass border ${c.borderClass} rounded-2xl p-6 transition-all duration-300`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                    <span className={`text-sm font-bold ${c.textClass}`}>{c.label}</span>
                  </div>
                  <span
                    className={`text-xl font-black ${c.textClass}`}
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    {count}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed mb-4">{c.desc}</p>

                {/* Centroid */}
                <div className={`${c.bgClass} border ${c.borderClass} rounded-xl p-3 mb-4`}>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-1.5 font-semibold">
                    Rata-rata Centroid (2015–2023)
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      Sampah:{" "}
                      <span className={c.textClass}>
                        {(centroid.avgSampah / 1000).toFixed(0)}k ton
                      </span>
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      Banjir:{" "}
                      <span className={c.textClass}>{centroid.avgBanjir} kejadian</span>
                    </span>
                  </div>
                </div>

                {/* Regions */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Wilayah ({count})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {regions.slice(0, 8).map((r) => (
                      <span
                        key={r.nama}
                        className={`text-xs px-2 py-0.5 rounded-md ${c.bgClass} ${c.textClass} border ${c.borderClass}`}
                      >
                        {r.nama
                          .replace("KABUPATEN ", "Kab. ")
                          .replace("KOTA ", "Kota ")
                          .slice(0, 18)}
                      </span>
                    ))}
                    {regions.length > 8 && (
                      <span className="text-xs px-2 py-0.5 rounded-md glass text-slate-500 dark:text-slate-500">
                        +{regions.length - 8} lainnya
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
