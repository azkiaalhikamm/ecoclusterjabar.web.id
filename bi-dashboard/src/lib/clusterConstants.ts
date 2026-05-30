/**
 * @file clusterConstants.ts
 * @description Single source of truth untuk data hasil K-Means Clustering.
 *
 * METODOLOGI:
 * Data bersumber dari hasil_cluster.csv (2015–2023), diproses dengan:
 *   1. StandardScaler normalization pada fitur jumlah_banjir & jumlah_sampah
 *   2. K-Means Clustering (k=3, random_state=42)
 *   3. Mapping label berdasarkan centroid risk score (banjir + sampah)
 *   4. Agregasi per wilayah: digunakan cluster tertinggi (peak-risk) selama
 *      periode 2015–2023 sebagai representasi risiko wilayah pada peta.
 *
 * Evaluasi Model:
 *   - Silhouette Score : 0.707  (Excellent)
 *   - Davies-Bouldin   : 0.412
 *   - Calinski-Harabasz: 428.3
 *   - K optimal        : 3
 *
 * Label mapping (sesuai centroid risk score terendah → tertinggi):
 *   Cluster → Wilayah Risiko Rendah  (banjir & sampah paling rendah)
 *   Cluster → Wilayah Risiko Sedang  (banjir & sampah moderat)
 *   Cluster → Wilayah Risiko Tinggi  (banjir & sampah tertinggi)
 *
 * Distribusi (peak-risk per wilayah):
 *   Risiko Rendah : 19 wilayah
 *   Risiko Sedang :  4 wilayah
 *   Risiko Tinggi :  4 wilayah
 *   Total         : 27 wilayah
 */

export interface RegionCluster {
  nama: string;
  lat: number;
  lon: number;
  /** Numerik cluster (0=Rendah, 1=Sedang, 2=Tinggi) */
  cluster: 0 | 1 | 2;
  /** Label akademik sesuai laporan */
  kategori: "Wilayah Risiko Rendah" | "Wilayah Risiko Sedang" | "Wilayah Risiko Tinggi";
  /** Total kejadian banjir (kumulatif 2015–2023) */
  banjir: number;
  /** Total volume sampah / ton (kumulatif 2015–2023) */
  sampah: number;
}

/** 27 wilayah Jawa Barat dengan cluster representatif (peak-risk 2015–2023) */
export const CLUSTER_REGIONS: RegionCluster[] = [
  // ── CLUSTER 0 — Wilayah Risiko Rendah (19 wilayah) ──────────────────────────
  { nama: "KABUPATEN BANDUNG BARAT", lat: -6.86, lon: 107.48, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 33,  sampah: 1144607.96  },
  { nama: "KABUPATEN BEKASI",        lat: -6.24, lon: 107.00, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 74,  sampah: 1717856.88  },
  { nama: "KABUPATEN CIAMIS",        lat: -7.33, lon: 108.35, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 60,  sampah: 287728.38   },
  { nama: "KABUPATEN CIANJUR",       lat: -6.82, lon: 107.14, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 57,  sampah: 1083007.66  },
  { nama: "KABUPATEN GARUT",         lat: -7.21, lon: 107.90, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 95,  sampah: 722017.15   },
  { nama: "KABUPATEN INDRAMAYU",     lat: -6.33, lon: 108.32, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 30,  sampah: 1253530.21  },
  { nama: "KABUPATEN KARAWANG",      lat: -6.30, lon: 107.30, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 83,  sampah: 1399423.27  },
  { nama: "KABUPATEN KUNINGAN",      lat: -6.98, lon: 108.48, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 37,  sampah: 371064.03   },
  { nama: "KABUPATEN MAJALENGKA",    lat: -6.84, lon: 108.23, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 59,  sampah: 410547.28   },
  { nama: "KABUPATEN PANGANDARAN",   lat: -7.69, lon: 108.65, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 31,  sampah: 209448.45   },
  { nama: "KABUPATEN PURWAKARTA",    lat: -6.54, lon: 107.45, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 15,  sampah: 450562.78   },
  { nama: "KABUPATEN SUBANG",        lat: -6.57, lon: 107.75, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 45,  sampah: 755673.83   },
  { nama: "KABUPATEN SUMEDANG",      lat: -6.85, lon: 107.92, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 94,  sampah: 447433.03   },
  { nama: "KABUPATEN TASIKMALAYA",   lat: -7.35, lon: 108.22, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 36,  sampah: 888803.05   },
  { nama: "KOTA BANJAR",             lat: -7.37, lon: 108.54, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 5,   sampah: 314030.36   },
  { nama: "KOTA CIMAHI",             lat: -6.88, lon: 107.54, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 66,  sampah: 1299860.57  },
  { nama: "KOTA CIREBON",            lat: -6.71, lon: 108.56, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 22,  sampah: 840189.89   },
  { nama: "KOTA SUKABUMI",           lat: -6.91, lon: 106.93, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 13,  sampah: 811273.68   },
  { nama: "KOTA TASIKMALAYA",        lat: -7.33, lon: 108.20, cluster: 0, kategori: "Wilayah Risiko Rendah",  banjir: 39,  sampah: 693584.94   },
  // ── CLUSTER 1 — Wilayah Risiko Sedang (4 wilayah) ───────────────────────────
  { nama: "KOTA BANDUNG",            lat: -6.91, lon: 107.61, cluster: 1, kategori: "Wilayah Risiko Sedang",  banjir: 48,  sampah: 6160806.79  },
  { nama: "KOTA BEKASI",             lat: -6.24, lon: 106.99, cluster: 1, kategori: "Wilayah Risiko Sedang",  banjir: 56,  sampah: 5635350.12  },
  { nama: "KOTA BOGOR",              lat: -6.60, lon: 106.80, cluster: 1, kategori: "Wilayah Risiko Sedang",  banjir: 91,  sampah: 2610593.20  },
  { nama: "KOTA DEPOK",              lat: -6.40, lon: 106.82, cluster: 1, kategori: "Wilayah Risiko Sedang",  banjir: 20,  sampah: 4592734.66  },
  // ── CLUSTER 2 — Wilayah Risiko Tinggi (4 wilayah) ───────────────────────────
  { nama: "KABUPATEN BANDUNG",       lat: -7.02, lon: 107.52, cluster: 2, kategori: "Wilayah Risiko Tinggi",  banjir: 237, sampah: 3504342.02  },
  { nama: "KABUPATEN BOGOR",         lat: -6.59, lon: 106.79, cluster: 2, kategori: "Wilayah Risiko Tinggi",  banjir: 232, sampah: 2616309.09  },
  { nama: "KABUPATEN CIREBON",       lat: -6.73, lon: 108.55, cluster: 2, kategori: "Wilayah Risiko Tinggi",  banjir: 90,  sampah: 975231.16   },
  { nama: "KABUPATEN SUKABUMI",      lat: -6.92, lon: 106.93, cluster: 2, kategori: "Wilayah Risiko Tinggi",  banjir: 134, sampah: 625659.60   },
];

/** Helper: filter per cluster */
export const getByCluster = (c: 0 | 1 | 2) => CLUSTER_REGIONS.filter(r => r.cluster === c);

/** Jumlah wilayah per kategori */
export const CLUSTER_COUNTS = {
  rendah: CLUSTER_REGIONS.filter(r => r.cluster === 0).length,  // 19
  sedang: CLUSTER_REGIONS.filter(r => r.cluster === 1).length,  // 4
  tinggi: CLUSTER_REGIONS.filter(r => r.cluster === 2).length,  // 4
  total:  CLUSTER_REGIONS.length,                                // 27
} as const;

/** Centroid rata-rata per cluster (dihitung dari data kumulatif 2015–2023) */
export const CLUSTER_CENTROIDS = [
  {
    label: "Risiko Rendah",
    avgBanjir: Math.round(getByCluster(0).reduce((s, r) => s + r.banjir, 0) / CLUSTER_COUNTS.rendah),
    avgSampah: Math.round(getByCluster(0).reduce((s, r) => s + r.sampah, 0) / CLUSTER_COUNTS.rendah),
  },
  {
    label: "Risiko Sedang",
    avgBanjir: Math.round(getByCluster(1).reduce((s, r) => s + r.banjir, 0) / CLUSTER_COUNTS.sedang),
    avgSampah: Math.round(getByCluster(1).reduce((s, r) => s + r.sampah, 0) / CLUSTER_COUNTS.sedang),
  },
  {
    label: "Risiko Tinggi",
    avgBanjir: Math.round(getByCluster(2).reduce((s, r) => s + r.banjir, 0) / CLUSTER_COUNTS.tinggi),
    avgSampah: Math.round(getByCluster(2).reduce((s, r) => s + r.sampah, 0) / CLUSTER_COUNTS.tinggi),
  },
];

/** Metadata evaluasi model K-Means */
export const MODEL_METRICS = {
  algorithm:       "K-Means Clustering",
  k:               3,
  silhouetteScore: 0.707,
  silhouetteGrade: "Excellent",
  daviesBouldin:   0.412,
  calinskiHarabasz: 428.3,
  features:        ["jumlah_banjir", "jumlah_sampah"],
  scaler:          "StandardScaler",
  randomState:     42,
  period:          "2015–2023",
} as const;

/** Metadata visual per klaster (warna, border, dll.) */
export const CLUSTER_STYLE = [
  { cluster: 0, label: "Risiko Rendah", color: "#10b981", textClass: "text-emerald-400", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/30" },
  { cluster: 1, label: "Risiko Sedang", color: "#f59e0b", textClass: "text-amber-400",   bgClass: "bg-amber-500/10",   borderClass: "border-amber-500/30"   },
  { cluster: 2, label: "Risiko Tinggi", color: "#ef4444", textClass: "text-red-400",     bgClass: "bg-red-500/10",     borderClass: "border-red-500/30"     },
] as const;
