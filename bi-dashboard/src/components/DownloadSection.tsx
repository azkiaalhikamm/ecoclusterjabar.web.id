"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Database, Download, FileText, FileJson, Link2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { API } from "@/lib/api";

const datasets = [
  {
    title: "Dataset Banjir dan Produksi Sampah Jawa Barat (2015–2023)",
    description: "Dataset gabungan multi-source dari Open Data Jabar. Berisi data kejadian banjir dan volume sampah. Dataset digunakan untuk analisis Business Intelligence dan clustering wilayah. Dataset terdiri dari 243 baris dan 11 kolom.",
    format: "CSV / XLSX",
    size: "243 Baris",
    updated: "2015-2023",
    icon: Database,
    href: API.DOWNLOAD_RAW,
  },
  {
    title: "Hasil Analisis K-Means Clustering",
    description: "Dataset hasil preprocessing dan clustering wilayah. Mengelompokkan wilayah ke dalam kategori: Risiko Rendah, Risiko Sedang, dan Risiko Tinggi. Digunakan untuk visualisasi dan analisis prioritas penanganan.",
    format: "CSV",
    size: "3 Klaster",
    updated: "Hasil Analisis",
    icon: FileJson,
    href: API.DOWNLOAD_CLUSTERED,
  },
  {
    title: "Data Warehouse & Output ETL",
    description: "Berisi hasil proses ETL dan struktur data warehouse. Meliputi: dim_waktu, dim_lokasi, fact_banjir_sampah. Digunakan sebagai sumber analisis dan visualisasi dashboard BI.",
    format: "Data Warehouse",
    size: "Star Schema",
    updated: "Output ETL",
    icon: FileText,
    href: API.CLUSTERING_RESULTS,
  },
];

const references = [
  {
    source: "Open Data Jabar",
    description: "Volume Sampah yang Ditangani Berdasarkan Kabupaten/Kota di Jawa Barat",
    href: "https://opendata.jabarprov.go.id/id/dataset/jumlah-sampah-yang-ditangani-berdasarkan-kabupatenkota-di-jawa-barat",
  },
  {
    source: "Open Data Jabar",
    description: "Jumlah Kejadian Bencana Banjir Berdasarkan Kabupaten/Kota di Jawa Barat",
    href: "https://opendata.jabarprov.go.id/id/dataset/jumlah-kejadian-bencana-banjir-berdasarkan-kabupatenkota-di-jawa-barat",
  },
];

export default function DownloadSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="download" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50 dark:via-cyan-950/10 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-5 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Database className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-300 tracking-widest uppercase">
              Pusat Data
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Download <span className="gradient-text">Center</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Pusat data digunakan untuk menyediakan dataset, hasil clustering, dan output ETL 
            yang mendukung proses analisis dan visualisasi Business Intelligence.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Datasets List */}
          <div className="space-y-4 mb-16">
            {datasets.map((dataset, i) => (
              <motion.div
                key={dataset.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors duration-300 group flex flex-col md:flex-row gap-6 md:items-center justify-between"
              >
                <div className="flex gap-5 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-colors">
                    <dataset.icon className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{dataset.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {dataset.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50">
                        {dataset.format}
                      </span>
                      <span className="flex items-center gap-1.5">
                        • {dataset.size}
                      </span>
                      <span className="flex items-center gap-1.5">
                        • {dataset.updated}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <a
                    href={dataset.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border border-slate-200 dark:border-white/10 hover:border-cyan-500/30 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reference Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass border border-slate-200 dark:border-white/5 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
              <Link2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sumber Referensi Resmi</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Berikut adalah tautan sumber rujukan resmi yang digunakan sebagai dasar penyusunan dataset dan dashboard Business Intelligence ini:
            </p>

            <ul className="space-y-4">
              {references.map((ref, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <div className="text-sm">
                    <Link href={ref.href} target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors inline-flex items-center gap-1 group">
                      {ref.source}
                      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <span className="text-slate-600 dark:text-slate-400"> — {ref.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
