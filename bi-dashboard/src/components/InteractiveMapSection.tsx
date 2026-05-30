"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { MapPin, Layers, Map, ExternalLink, Info, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import {
  CLUSTER_REGIONS,
  CLUSTER_COUNTS,
  CLUSTER_STYLE,
} from "@/lib/clusterConstants";
import { API } from "@/lib/api";

/** clusterData & clusterMeta dideklarasikan di clusterConstants.ts (single source of truth) */

// Build self-contained Leaflet HTML as blob URL
function buildMapHTML(isDark: boolean): string {
  const markersJS = CLUSTER_REGIONS.map(d => {
    const colorMap: Record<number, string> = { 0: "#10b981", 1: "#f59e0b", 2: "#ef4444" };
    const color = colorMap[d.cluster] ?? "#64748b";
    const nm = d.nama.replace(/'/g, "\\'");
    const kt = d.kategori.replace(/'/g, "\\'");
    const sampahFmt = d.sampah >= 1000
      ? `${(d.sampah / 1000).toFixed(1)}k ton`
      : `${d.sampah.toFixed(1)} ton`;

    if (isDark) {
      return `L.circleMarker([${d.lat},${d.lon}],{radius:10,fillColor:'${color}',color:'#fff',weight:1.5,opacity:.9,fillOpacity:.85}).addTo(map).bindPopup('<div style="font-family:Inter,sans-serif;min-width:210px;background:#0f172a;border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden"><div style="background:${color}22;border-bottom:1px solid ${color}44;padding:10px 14px"><p style="font-size:13px;font-weight:700;color:#f1f5f9;margin:0">${nm}</p><p style="font-size:11px;color:${color};margin:3px 0 0;font-weight:600">${kt}</p></div><div style="padding:10px 14px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:11px;color:#94a3b8">Jumlah Banjir</span><span style="font-size:11px;font-weight:700;color:#60a5fa">${d.banjir} kejadian</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:11px;color:#94a3b8">Volume Sampah</span><span style="font-size:11px;font-weight:700;color:#34d399">${sampahFmt}</span></div><div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.08)"><span style="font-size:10px;color:#475569">K-Means Cluster ${d.cluster} · Periode 2015–2023</span></div></div></div>',{maxWidth:240,className:'cp'});`;
    }
    return `L.circleMarker([${d.lat},${d.lon}],{radius:10,fillColor:'${color}',color:'#fff',weight:1.5,opacity:.9,fillOpacity:.9}).addTo(map).bindPopup('<div style="font-family:Inter,sans-serif;min-width:210px;background:#ffffff;border:1px solid rgba(15,23,42,.1);border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,.12)"><div style="background:${color}1a;border-bottom:1px solid ${color}55;padding:10px 14px"><p style="font-size:13px;font-weight:700;color:#0f172a;margin:0">${nm}</p><p style="font-size:11px;color:${color};margin:3px 0 0;font-weight:700">${kt}</p></div><div style="padding:10px 14px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:11px;color:#64748b">Jumlah Banjir</span><span style="font-size:11px;font-weight:700;color:#2563eb">${d.banjir} kejadian</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:11px;color:#64748b">Volume Sampah</span><span style="font-size:11px;font-weight:700;color:#059669">${sampahFmt}</span></div><div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(15,23,42,.08)"><span style="font-size:10px;color:#94a3b8">K-Means Cluster ${d.cluster} · Periode 2015–2023</span></div></div></div>',{maxWidth:240,className:'cp'});`;
  }).join("\n");

  const darkStyles = `
*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;background:#020817}
#map{width:100%;height:100%}
.leaflet-container{background:#0a1628!important}
.leaflet-popup-content-wrapper{background:transparent!important;border:none!important;box-shadow:0 8px 32px rgba(0,0,0,.6)!important;padding:0!important;border-radius:12px!important}
.leaflet-popup-content{margin:0!important}.leaflet-popup-tip-container{display:none!important}
.leaflet-tile{filter:brightness(.5) saturate(.35) hue-rotate(200deg)}`;

  const lightStyles = `
*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;background:#f8fafc}
#map{width:100%;height:100%}
.leaflet-container{background:#eef2ff!important}
.leaflet-popup-content-wrapper{background:transparent!important;border:none!important;box-shadow:0 8px 32px rgba(15,23,42,.35)!important;padding:0!important;border-radius:12px!important}
.leaflet-popup-content{margin:0!important}.leaflet-popup-tip-container{display:none!important}`;

  const legendJS = isDark
    ? `lg.onAdd=function(){var d=L.DomUtil.create('div');d.style.cssText='background:rgba(15,23,42,.92);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 14px;font-family:Inter,sans-serif;backdrop-filter:blur(12px);';
d.innerHTML='<p style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Kategori Risiko</p>'+
'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><div style="width:12px;height:12px;border-radius:50%;background:#10b981;flex-shrink:0"></div><span style="color:#e2e8f0;font-size:11px">Risiko Rendah</span></div>'+
'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><div style="width:12px;height:12px;border-radius:50%;background:#f59e0b;flex-shrink:0"></div><span style="color:#e2e8f0;font-size:11px">Risiko Sedang</span></div>'+
'<div style="display:flex;align-items:center;gap:8px"><div style="width:12px;height:12px;border-radius:50%;background:#ef4444;flex-shrink:0"></div><span style="color:#e2e8f0;font-size:11px">Risiko Tinggi</span></div>';
return d;};lg.addTo(map);`
    : `lg.onAdd=function(){var d=L.DomUtil.create('div');d.style.cssText='background:rgba(255,255,255,.95);border:1px solid rgba(15,23,42,.1);border-radius:10px;padding:12px 14px;font-family:Inter,sans-serif;backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(15,23,42,.12);';
d.innerHTML='<p style="color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Kategori Risiko</p>'+
'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><div style="width:12px;height:12px;border-radius:50%;background:#10b981;flex-shrink:0"></div><span style="color:#0f172a;font-size:11px">Risiko Rendah</span></div>'+
'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><div style="width:12px;height:12px;border-radius:50%;background:#f59e0b;flex-shrink:0"></div><span style="color:#0f172a;font-size:11px">Risiko Sedang</span></div>'+
'<div style="display:flex;align-items:center;gap:8px"><div style="width:12px;height:12px;border-radius:50%;background:#ef4444;flex-shrink:0"></div><span style="color:#0f172a;font-size:11px">Risiko Tinggi</span></div>';
return d;};lg.addTo(map);`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>${isDark ? darkStyles : lightStyles}</style></head>
<body><div id="map"></div>
<script>
var map=L.map('map',{zoomControl:true,scrollWheelZoom:true}).setView([-6.9,107.6],8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:13}).addTo(map);
var lg=L.control({position:'bottomright'});
${legendJS}
${markersJS}
<\/script></body></html>`;
}

export default function InteractiveMapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [mapSrc, setMapSrc] = useState<string>("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = resolvedTheme === "dark";
    const html = buildMapHTML(isDark);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setMapSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [resolvedTheme]);

  return (
    <section id="peta-interaktif" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 tracking-widest uppercase">
              Geospatial Visualization · Smart Environment
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Peta Sebaran{" "}
            <span className="gradient-text">Interaktif</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Visualisasi geospasial digunakan untuk menampilkan persebaran wilayah berdasarkan
            hasil clustering tingkat banjir dan volume sampah di Provinsi Jawa Barat.
          </p>
        </motion.div>

        {/* ── Cluster Summary Pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid sm:grid-cols-3 gap-5 mb-10"
        >
          {[...CLUSTER_STYLE].map((c, i) => {
            const count = c.cluster === 0 ? CLUSTER_COUNTS.rendah : c.cluster === 1 ? CLUSTER_COUNTS.sedang : CLUSTER_COUNTS.tinggi;
            return (
              <motion.div
                key={c.cluster}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1 }}
                className={`glass border ${c.borderClass} rounded-2xl p-5 flex items-center gap-4 shine-effect`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${c.color}22`, boxShadow: `0 0 16px ${c.color}33` }}
                >
                  <div className="w-4 h-4 rounded-full" style={{ background: c.color }} />
                </div>
                <div>
                  <p className={`text-2xl font-black ${c.textClass}`} style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    {count}
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{c.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">wilayah teridentifikasi</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main Layout: Left + Right ── */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── Left: Description Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Distribusi Klaster */}
            <div className="glass border border-slate-200 dark:border-white/8 rounded-2xl p-6 card-glow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Map className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Distribusi Klaster Wilayah</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Algoritma K-Means Clustering (k=3) mengelompokkan 27 kabupaten/kota di
                Provinsi Jawa Barat berdasarkan dua variabel utama:{" "}
                <span className="text-blue-600 dark:text-blue-400 font-semibold">frekuensi kejadian banjir</span> dan{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">volume timbulan sampah</span>{" "}
                periode 2015–2023.
              </p>
              <div className="space-y-3">
                {[
                  {
                    emoji: "🟢",
                    label: "Risiko Rendah",
                    desc: "Wilayah dengan frekuensi banjir dan volume sampah relatif rendah serta memerlukan pemantauan rutin.",
                    color: "border-emerald-500/20 bg-emerald-500/5",
                  },
                  {
                    emoji: "🟡",
                    label: "Risiko Sedang",
                    desc: "Wilayah dengan tingkat risiko moderat yang memerlukan peningkatan pengelolaan lingkungan dan monitoring berkala.",
                    color: "border-amber-500/20 bg-amber-500/5",
                  },
                  {
                    emoji: "🔴",
                    label: "Risiko Tinggi",
                    desc: "Wilayah dengan frekuensi banjir dan volume sampah tinggi sehingga menjadi prioritas penanganan lingkungan.",
                    color: "border-red-500/20 bg-red-500/5",
                  },
                ].map(item => (
                  <div key={item.label} className={`rounded-xl border p-3.5 ${item.color}`}>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      {item.emoji} {item.label}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relevansi Smart City */}
            <div className="glass border border-blue-500/15 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Relevansi Smart City</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                Peta sebaran ini mendukung dua dimensi Smart City dalam pengambilan keputusan berbasis data:
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Smart Environment</span> —
                    pemantauan risiko lingkungan berbasis data spasial dan pengelolaan
                    lingkungan yang berkelanjutan.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Smart Governance</span> —
                    mendukung perencanaan kebijakan pengelolaan banjir dan sampah berbasis
                    analitik klaster wilayah.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href={API.VISUALIZATION_MAP}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #2563eb 100%)",
                boxShadow: "0 0 24px rgba(5,150,105,0.35), 0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Buka Peta Interaktif
            </motion.a>
          </motion.div>

          {/* ── Right: Leaflet Map ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div
              className="glass border border-slate-200 dark:border-white/8 rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 0 40px rgba(5,150,105,0.12), 0 25px 60px rgba(0,0,0,0.15)" }}
            >
              {/* Map topbar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-white/8 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Peta Sebaran Wilayah Berdasarkan Hasil Clustering
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
              </div>

              {/* Leaflet iframe */}
              <div className="relative" style={{ height: "480px" }}>
                {mapSrc ? (
                  <iframe
                    src={mapSrc}
                    className="w-full h-full border-0"
                    title="Peta Sebaran Wilayah Berdasarkan Hasil Clustering K-Means"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-900/60">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-slate-600 dark:text-slate-500">Memuat peta geospasial…</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map footer */}
              <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-200 dark:border-white/8 bg-slate-50/50 dark:bg-white/[0.02]">
                <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500 flex-shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-500">
                  Klik marker untuk melihat detail wilayah berdasarkan hasil clustering metode K-Means (k=3) periode 2015–2023.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
