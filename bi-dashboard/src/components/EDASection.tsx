"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Search, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Loader2, Activity } from "lucide-react";
import { API } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "rgba(15,23,42,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#e2e8f0",
  fontSize: "12px",
};

// Themed tooltip content
const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip rounded-xl px-3 py-2">
      {label !== undefined && label !== "" && <p className="chart-tooltip-title font-bold text-xs mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color || "inherit" }}>
          <span className="chart-tooltip-label">{p.name}:</span>{" "}
          <span style={{ fontWeight: 600 }}>
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function EDASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edaData, setEdaData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"banjir" | "sampah">("banjir");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API.EDA_STATS);
        if (!res.ok) throw new Error("Gagal mengambil data EDA dari server");
        const data = await res.json();
        setEdaData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRegionName = (name: string) =>
    name.replace("KABUPATEN ", "Kab. ").replace("KOTA ", "Kota ");

  return (
    <section id="eda" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50 dark:via-amber-950/10 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-5">
            <Search className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 tracking-widest uppercase">
              Exploratory Data Analysis
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Eksplorasi{" "}
            <span className="gradient-text">Data Awal</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Analisis statistik deskriptif dan visualisasi pola awal pada dataset banjir
            dan sampah Jawa Barat periode 2015–2023 sebelum dilakukan clustering.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl border border-slate-300 dark:border-white/10">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Memuat data EDA...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 glass border border-red-500/20 rounded-3xl">
            <p>Error: {error}</p>
            <p className="text-sm text-slate-500 mt-2">Pastikan server backend aktif (python main.py)</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Row 1: Statistik Deskriptif */}
            <div className="glass border border-slate-300 dark:border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <BarChart3 className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Statistik Deskriptif</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-500">Ringkasan numerik dari 243 record data (27 kab/kota × 9 tahun)</p>
                </div>
              </div>

              {/* Toggle Tabs */}
              <div className="flex gap-2 mb-6">
                {(["banjir", "sampah"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40"
                        : "text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                    }`}
                  >
                    {tab === "banjir" ? "🌊 Kejadian Banjir" : "🗑️ Volume Sampah"}
                  </button>
                ))}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "Rata-rata", value: edaData.descriptive[activeTab].mean, color: "text-blue-600 dark:text-blue-400" },
                  { label: "Median", value: edaData.descriptive[activeTab].median, color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Std. Deviasi", value: edaData.descriptive[activeTab].std, color: "text-violet-600 dark:text-violet-400" },
                  { label: "Minimum", value: edaData.descriptive[activeTab].min, color: "text-cyan-600 dark:text-cyan-400" },
                  { label: "Maksimum", value: edaData.descriptive[activeTab].max, color: "text-red-600 dark:text-red-400" },
                  { label: "Total Record", value: edaData.descriptive[activeTab].total_records, color: "text-amber-600 dark:text-amber-400" },
                ].map((stat) => (
                  <div key={stat.label} className="glass border border-slate-200 dark:border-white/5 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-500 mb-1">{stat.label}</p>
                    <p className={`text-lg font-black ${stat.color}`} style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                      {activeTab === "sampah" && stat.label !== "Total Record"
                        ? `${(Number(stat.value) / 1000).toFixed(1)}k`
                        : stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-600">
                      {activeTab === "banjir" ? "kejadian" : "ton"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Tren Tahunan + Distribusi */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Tren Tahunan */}
              <div className="glass border border-slate-300 dark:border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tren Tahunan (2015–2023)</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={edaData.trend}
                      margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
                    >
                      <defs>
                        <linearGradient id="edaColorBanjir" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="edaColorSampah" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                      <XAxis dataKey="tahun" className="chart-axis" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" className="chart-axis" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" className="chart-axis" tick={{ fontSize: 10 }} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="total_banjir"
                        stroke="#3b82f6"
                        fill="url(#edaColorBanjir)"
                        strokeWidth={2}
                        name="Total Banjir (kejadian)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="total_sampah"
                        stroke="#10b981"
                        fill="url(#edaColorSampah)"
                        strokeWidth={2}
                        name="Total Sampah (ton)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 rounded bg-blue-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-500">Total Banjir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 rounded bg-emerald-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-500">Total Sampah</span>
                  </div>
                </div>
              </div>

              {/* Distribusi Histogram */}
              <div className="glass border border-slate-300 dark:border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <BarChart3 className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Distribusi Data {activeTab === "banjir" ? "Banjir" : "Sampah"}
                  </h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={edaData.distribution[activeTab]}
                      margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                      <XAxis dataKey="range" className="chart-axis" tick={{ fontSize: 10 }} />
                      <YAxis className="chart-axis" tick={{ fontSize: 10 }} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="count"
                        name="Jumlah Record"
                        fill={activeTab === "banjir" ? "#3b82f6" : "#10b981"}
                        radius={[6, 6, 0, 0]}
                        opacity={0.85}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-500 text-center mt-3">
                  {activeTab === "banjir"
                    ? "Distribusi frekuensi kejadian banjir (per record)"
                    : "Distribusi volume sampah dalam ton (per record)"}
                </p>
              </div>
            </div>

            {/* Row 3: Top & Bottom 5 Wilayah */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top 5 */}
              <div className="glass border border-slate-300 dark:border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <ArrowUpRight className="w-4 h-4 text-red-500 dark:text-red-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top 5 — Rata-rata Tertinggi</h3>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Top 5 Banjir */}
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-3">🌊 Banjir</p>
                    <div className="space-y-2">
                      {edaData.top_bottom.top_banjir.map((item: any, i: number) => (
                        <div key={item.region} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-500 dark:text-slate-600 w-4">{i + 1}</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300">{formatRegionName(item.region)}</span>
                          </div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.value} kj/thn</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Top 5 Sampah */}
                  <div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-3">🗑️ Sampah</p>
                    <div className="space-y-2">
                      {edaData.top_bottom.top_sampah.map((item: any, i: number) => (
                        <div key={item.region} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-500 dark:text-slate-600 w-4">{i + 1}</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300">{formatRegionName(item.region)}</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{(item.value / 1000).toFixed(0)}k ton</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom 5 */}
              <div className="glass border border-slate-300 dark:border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <ArrowDownRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bottom 5 — Rata-rata Terendah</h3>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Bottom 5 Banjir */}
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-3">🌊 Banjir</p>
                    <div className="space-y-2">
                      {edaData.top_bottom.bottom_banjir.map((item: any, i: number) => (
                        <div key={item.region} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-500 dark:text-slate-600 w-4">{i + 1}</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300">{formatRegionName(item.region)}</span>
                          </div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.value} kj/thn</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Bottom 5 Sampah */}
                  <div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-3">🗑️ Sampah</p>
                    <div className="space-y-2">
                      {edaData.top_bottom.bottom_sampah.map((item: any, i: number) => (
                        <div key={item.region} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-500 dark:text-slate-600 w-4">{i + 1}</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300">{formatRegionName(item.region)}</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{(item.value / 1000).toFixed(0)}k ton</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Korelasi Scatter Plot */}
            <div className="glass border border-slate-300 dark:border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <Activity className="w-4.5 h-4.5 text-violet-500 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Korelasi Banjir vs Sampah</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-500">Hubungan antara frekuensi banjir dan volume sampah per wilayah</p>
                  </div>
                </div>
                <div className="glass border border-violet-500/30 rounded-xl px-4 py-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Koefisien Korelasi (Pearson)</p>
                  <p className="text-2xl font-black text-violet-600 dark:text-violet-400" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    r = {edaData.correlation.value}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-500">
                    {Math.abs(edaData.correlation.value) > 0.5
                      ? "Korelasi kuat — wilayah dengan banjir tinggi cenderung memiliki sampah tinggi"
                      : Math.abs(edaData.correlation.value) > 0.3
                      ? "Korelasi sedang — ada kecenderungan hubungan positif"
                      : "Korelasi lemah — banjir dan sampah tidak selalu berkorelasi langsung"}
                  </p>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                    <XAxis
                      dataKey="banjir"
                      name="Banjir"
                      className="chart-axis"
                      tick={{ fontSize: 10 }}
                      label={{ value: "Rata-rata Banjir (kejadian/tahun)", position: "insideBottom", offset: -5, fontSize: 10, className: "chart-axis-label" }}
                    />
                    <YAxis
                      dataKey="sampah"
                      name="Sampah"
                      className="chart-axis"
                      tick={{ fontSize: 10 }}
                      label={{ value: "Rata-rata Sampah (ton)", angle: -90, position: "insideLeft", offset: 10, fontSize: 10, className: "chart-axis-label" }}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      cursor={{ strokeDasharray: "3 3" }}
                    />
                    <Scatter
                      name="Wilayah"
                      data={edaData.correlation.scatter}
                      fill="#8b5cf6"
                      opacity={0.8}
                    >
                      {edaData.correlation.scatter.map((_: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            edaData.correlation.scatter[index].banjir > 15
                              ? "#ef4444"
                              : edaData.correlation.scatter[index].banjir > 8
                              ? "#f59e0b"
                              : "#10b981"
                          }
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-500">Banjir Tinggi ({">"} 15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-500">Banjir Sedang (8-15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-500">Banjir Rendah ({"<"} 8)</span>
                </div>
              </div>
            </div>

            {/* Insight Box */}
            <div className="glass border border-amber-500/20 rounded-3xl p-6 sm:p-8">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4">📊 Insight Awal dari EDA</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Dominasi Risiko Rendah",
                    desc: "Mayoritas dari 27 kab/kota memiliki frekuensi banjir rendah (0-5 kejadian/tahun), namun beberapa outlier seperti Kab. Bandung dan Kab. Bogor memiliki frekuensi sangat tinggi.",
                    icon: "📌"
                  },
                  {
                    title: "Disparitas Volume Sampah",
                    desc: "Terdapat kesenjangan besar dalam volume sampah — Kota Bandung menghasilkan 10x lipat lebih banyak dibanding Kab. Pangandaran, menunjukkan faktor urbanisasi yang kuat.",
                    icon: "📈"
                  },
                  {
                    title: "Pola Korelasi",
                    desc: `Koefisien korelasi Pearson sebesar ${edaData.correlation.value} menunjukkan ${
                      Math.abs(edaData.correlation.value) > 0.5
                        ? "hubungan positif yang cukup kuat — cocok untuk dikelompokkan bersama dalam clustering."
                        : "hubungan yang perlu dianalisis lebih lanjut melalui metode clustering."
                    }`,
                    icon: "🔗"
                  },
                ].map((insight) => (
                  <div key={insight.title} className="glass border border-slate-200 dark:border-white/5 rounded-xl p-4">
                    <div className="text-xl mb-2">{insight.icon}</div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{insight.title}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-400 leading-relaxed">{insight.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
