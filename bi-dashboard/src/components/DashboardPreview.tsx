"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { LayoutDashboard, Loader2 } from "lucide-react";
import {
  CLUSTER_REGIONS,
  CLUSTER_CENTROIDS,
  CLUSTER_STYLE,
} from "@/lib/clusterConstants";
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Simulated static trend data (since backend doesn't aggregate by year yet)
const trendData = [
  { year: "2019", banjir: 110, sampah: 1200 },
  { year: "2020", banjir: 120, sampah: 1400 },
  { year: "2021", banjir: 135, sampah: 1600 },
  { year: "2022", banjir: 150, sampah: 1800 },
  { year: "2023", banjir: 180, sampah: 2100 },
];

/** Themed tooltip wrapper using CSS class so both themes render nicely */
const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip rounded-xl px-3 py-2">
      {label && <p className="chart-tooltip-title font-bold text-xs mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="chart-tooltip-label text-xs" style={{ color: p.color }}>
          <span className="chart-tooltip-label">{p.name}:</span>{" "}
          <span style={{ fontWeight: 600 }}>
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function DashboardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<string>("Semua");

  const [kpiStats, setKpiStats] = useState<any>(null);
  const [floodData, setFloodData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);

  // Since we are using static canonical data
  const allData = CLUSTER_REGIONS.map(r => ({
    region: r.nama,
    floodFrequency: r.banjir,
    wasteVolume: r.sampah,
    riskLevel: r.cluster === 2 ? "Tinggi" : r.cluster === 1 ? "Sedang" : "Rendah",
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filtered = selectedRisk === "Semua" ? allData : allData.filter(d => d.riskLevel === selectedRisk);

    const totalRegions = filtered.length;
    const avgWaste = totalRegions ? filtered.reduce((acc, curr) => acc + curr.wasteVolume, 0) / totalRegions : 0;
    const avgFlood = totalRegions ? filtered.reduce((acc, curr) => acc + curr.floodFrequency, 0) / totalRegions : 0;
    const highRiskRegions = selectedRisk === "Semua"
      ? allData.filter(d => d.riskLevel === "Tinggi").length
      : filtered.filter(d => d.riskLevel === "Tinggi").length;

    setKpiStats({
      total_regions: totalRegions,
      high_risk_regions: highRiskRegions,
      average_waste_tons: avgWaste,
      average_flood_frequency: avgFlood
    });

    const sortedByFlood = [...filtered].sort((a, b) => b.floodFrequency - a.floodFrequency);
    setFloodData(sortedByFlood.map(d => ({
      name: d.region.replace("KABUPATEN ", "Kab. ").replace("KOTA ", "Kota ").slice(0, 12),
      banjir: parseFloat(d.floodFrequency.toFixed(1))
    })));

    const riskCounts = { "Tinggi": 0, "Sedang": 0, "Rendah": 0 };
    filtered.forEach((d) => {
      riskCounts[d.riskLevel as keyof typeof riskCounts]++;
    });
    setPieData([
      { name: "Wilayah Risiko Tinggi", value: riskCounts["Tinggi"], color: CLUSTER_STYLE[2].color },
      { name: "Wilayah Risiko Sedang", value: riskCounts["Sedang"], color: CLUSTER_STYLE[1].color },
      { name: "Wilayah Risiko Rendah", value: riskCounts["Rendah"], color: CLUSTER_STYLE[0].color },
    ].filter(item => item.value > 0));

    const maxWaste = Math.max(...[0, 1, 2].map(c => CLUSTER_CENTROIDS[c].avgSampah));
    const maxFlood = Math.max(...[0, 1, 2].map(c => CLUSTER_CENTROIDS[c].avgBanjir));

    setRadarData([
      {
        subject: "Frekuensi Banjir",
        A: (CLUSTER_CENTROIDS[2].avgBanjir / maxFlood) * 100,
        B: (CLUSTER_CENTROIDS[1].avgBanjir / maxFlood) * 100,
        C: (CLUSTER_CENTROIDS[0].avgBanjir / maxFlood) * 100,
      },
      {
        subject: "Volume Sampah",
        A: (CLUSTER_CENTROIDS[2].avgSampah / maxWaste) * 100,
        B: (CLUSTER_CENTROIDS[1].avgSampah / maxWaste) * 100,
        C: (CLUSTER_CENTROIDS[0].avgSampah / maxWaste) * 100,
      },
      {
        subject: "Tingkat Risiko",
        A: 100, B: 50, C: 10
      },
    ]);

  }, [selectedRisk]);

  return (
    <section id="dashboard" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50 dark:via-blue-950/10 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-5">
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 tracking-widest uppercase">
              Interactive Dashboard
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Dashboard{" "}
            <span className="gradient-text">BI Preview</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Visualisasi interaktif hasil analisis banjir dan volume sampah di Provinsi Jawa Barat berdasarkan metode K-Means Clustering periode 2015–2023.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl border border-slate-200 dark:border-white/10">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading Dashboard Data...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/20"
          >
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="w-px h-4 bg-slate-300 dark:bg-white/10" />
                <span className="text-xs text-slate-600 dark:text-slate-500">BI Dashboard — Analisis Banjir & Sampah Jawa Barat 2015–2023</span>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="Semua">Semua Wilayah</option>
                  <option value="Tinggi">Wilayah Risiko Tinggi</option>
                  <option value="Sedang">Wilayah Risiko Sedang</option>
                  <option value="Rendah">Wilayah Risiko Rendah</option>
                </select>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 space-y-6">
              {/* Row 1 - Mini KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Wilayah Analisis", value: kpiStats?.total_regions || 0, unit: "kab/kota", color: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
                  { label: "Rata-rata Volume Sampah", value: ((kpiStats?.average_waste_tons || 0) / 1000).toFixed(1), unit: "ribu ton", color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
                  { label: "Wilayah Risiko Tinggi", value: kpiStats?.high_risk_regions || 0, unit: "wilayah", color: "text-red-600 dark:text-red-400", border: "border-red-500/20" },
                  { label: "Rata-rata Banjir", value: (kpiStats?.average_flood_frequency || 0).toFixed(1), unit: "kejadian", color: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20" },
                ].map((kpi) => (
                  <div key={kpi.label} className={`glass border ${kpi.border} rounded-xl p-4`}>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">{kpi.label}</p>
                    <p className={`text-xl font-black ${kpi.color}`} style={{ fontFamily: "var(--font-plus-jakarta)" }}>{kpi.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-600">{kpi.unit}</p>
                  </div>
                ))}
              </div>

              {/* Row 2 - Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Bar Chart - Flood by Region */}
                <div className="glass border border-slate-200 dark:border-white/8 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Kejadian Banjir per Wilayah</h4>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={floodData} margin={{ top: 5, right: 10, bottom: 45, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                        <XAxis dataKey="name" className="chart-axis" tick={{ fontSize: 9, angle: -45, textAnchor: 'end' }} interval={0} />
                        <YAxis className="chart-axis" tick={{ fontSize: 10 }} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="banjir" name="Banjir" fill="url(#blueGrad)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Area Chart - Trend */}
                <div className="glass border border-slate-200 dark:border-white/8 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Tren Data Historis Jawa Barat</h4>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <defs>
                          <linearGradient id="colorBanjir" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorSampah" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                        <XAxis dataKey="year" className="chart-axis" tick={{ fontSize: 10 }} />
                        <YAxis className="chart-axis" tick={{ fontSize: 10 }} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="banjir" stroke="#3b82f6" fill="url(#colorBanjir)" strokeWidth={2} name="Banjir (Indeks)" />
                        <Area type="monotone" dataKey="sampah" stroke="#10b981" fill="url(#colorSampah)" strokeWidth={2} name="Sampah (Ribuan Ton)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Row 3 - More Charts */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Pie Chart - Cluster Distribution */}
                <div className="glass border border-slate-200 dark:border-white/8 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Distribusi Cluster Risiko</h4>
                  <div className="h-44 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5">
                    {pieData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-xs text-slate-600 dark:text-slate-400">{d.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{d.value} kab/kota</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="glass border border-slate-200 dark:border-white/8 rounded-2xl p-5 lg:col-span-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Profil Karakteristik per Cluster (Normalized)</h4>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid className="chart-grid" />
                        <PolarAngleAxis dataKey="subject" className="chart-axis" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis className="chart-grid" tick={false} />
                        {(selectedRisk === "Semua" || selectedRisk === "Tinggi") && (
                          <Radar name="Wilayah Risiko Tinggi" dataKey="A" stroke={CLUSTER_STYLE[2].color} fill={CLUSTER_STYLE[2].color} fillOpacity={0.15} strokeWidth={2} />
                        )}
                        {(selectedRisk === "Semua" || selectedRisk === "Sedang") && (
                          <Radar name="Wilayah Risiko Sedang" dataKey="B" stroke={CLUSTER_STYLE[1].color} fill={CLUSTER_STYLE[1].color} fillOpacity={0.15} strokeWidth={2} />
                        )}
                        {(selectedRisk === "Semua" || selectedRisk === "Rendah") && (
                          <Radar name="Wilayah Risiko Rendah" dataKey="C" stroke={CLUSTER_STYLE[0].color} fill={CLUSTER_STYLE[0].color} fillOpacity={0.15} strokeWidth={2} />
                        )}
                        <Tooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
