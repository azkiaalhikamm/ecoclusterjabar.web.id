"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Database, GitMerge, Layers, Table2 } from "lucide-react";

export default function DataWarehouseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="data-warehouse" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50 dark:via-cyan-950/10 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-5">
            <Database className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-300 tracking-widest uppercase">
              Data Architecture
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Data Warehouse{" "}
            <span className="gradient-text">& Star Schema</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Arsitektur dimensional model dengan Star Schema untuk mengintegrasikan
            data banjir dan sampah dari multiple source ke dalam satu repositori analitik.
          </p>
        </motion.div>

        {/* Star Schema Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="glass border border-cyan-500/20 rounded-3xl p-8 card-glow">
            <div className="text-center mb-8">
              <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Star Schema Architecture</span>
            </div>

            {/* Schema Visual */}
            <div className="relative">
              {/* Center - Fact Table */}
              <div className="flex justify-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="glass border-2 border-blue-500/50 rounded-2xl p-5 w-56 text-center shadow-xl shadow-blue-500/20"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Table2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="text-xs font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">FACT TABLE</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mb-3">fact_banjir_sampah</div>
                  <div className="text-left space-y-1">
                    {["id_waktu", "id_wilayah", "jml_banjir", "vol_sampah", "cluster_id", "risk_score"].map((col) => (
                      <div key={col} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 dark:bg-blue-400/60" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{col}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Dimension Tables */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: "dim_waktu",
                    label: "Waktu",
                    color: "violet",
                    fields: ["id_waktu", "tahun", "bulan", "kuartal", "semester"],
                  },
                  {
                    name: "dim_wilayah",
                    label: "Wilayah",
                    color: "emerald",
                    fields: ["id_wilayah", "nama_kab_kota", "provinsi", "latitude", "longitude"],
                  },
                  {
                    name: "dim_cluster",
                    label: "Cluster",
                    color: "amber",
                    fields: ["cluster_id", "cluster_name", "risk_level", "centroid_x", "centroid_y"],
                  },
                  {
                    name: "dim_kategori",
                    label: "Kategori",
                    color: "red",
                    fields: ["id_kategori", "jenis_bencana", "tipe_sampah", "unit_ukur", "deskripsi"],
                  },
                ].map((dim) => {
                  const colMap: Record<string, string> = {
                    violet: "border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-500/10",
                    emerald: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                    amber: "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
                    red: "border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10",
                  };
                  const colorClass = colMap[dim.color];
                  const [borderColor, textColor, bgColor] = colorClass.split(" ");
                  return (
                    <motion.div
                      key={dim.name}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className={`glass border ${borderColor} rounded-xl p-4 transition-all duration-300`}
                    >
                      <div className={`text-xs font-black ${textColor} uppercase tracking-widest mb-1`}>
                        DIM
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">{dim.label}</div>
                      <div className={`text-xs font-mono ${textColor} mb-3`}>{dim.name}</div>
                      <div className="space-y-1">
                        {dim.fields.map((f) => (
                          <div key={f} className="flex items-center gap-2">
                            <div className={`w-1 h-1 rounded-full ${textColor.replace("text-", "bg-")}`} />
                            <span className="text-xs text-slate-600 dark:text-slate-500 font-mono">{f}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ETL Process Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: "Extract",
              icon: GitMerge,
              color: "text-blue-600 dark:text-blue-400",
              border: "border-blue-500/25",
              bg: "from-blue-500/10",
              items: [
                "Open Data Jawa Barat API",
                "CSV Bencana Banjir 2019–2023",
                "CSV Produksi Sampah 2019–2023",
                "Data Validasi BPS Jabar",
              ],
            },
            {
              step: "Transform",
              icon: Layers,
              color: "text-violet-600 dark:text-violet-400",
              border: "border-violet-500/25",
              bg: "from-violet-500/10",
              items: [
                "Normalisasi nama kab/kota",
                "Penanganan nilai kosong",
                "Feature engineering K-Means",
                "Standardisasi unit & format",
              ],
            },
            {
              step: "Load",
              icon: Database,
              color: "text-cyan-600 dark:text-cyan-400",
              border: "border-cyan-500/25",
              bg: "from-cyan-500/10",
              items: [
                "PostgreSQL Data Warehouse",
                "Star Schema population",
                "Cluster labeling & tagging",
                "Dashboard data refresh",
              ],
            },
          ].map((etl, i) => (
            <motion.div
              key={etl.step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`glass border ${etl.border} rounded-2xl p-6 shine-effect`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <etl.icon className={`w-4.5 h-4.5 ${etl.color}`} />
                </div>
                <div>
                  <div className={`text-xs font-black ${etl.color} uppercase tracking-widest`}>ETL Step</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{etl.step}</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {etl.items.map((item, j) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className={`text-xs font-black ${etl.color} mt-0.5 min-w-[16px]`}>{String(j + 1).padStart(2, "0")}</div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
