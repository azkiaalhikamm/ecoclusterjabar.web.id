/**
 * Konfigurasi API untuk koneksi ke backend FastAPI.
 * 
 * Ubah BASE_URL di sini saja jika backend sudah di-deploy ke server production.
 * Contoh production: "https://bi-dashboard-api.onrender.com"
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API = {
  /** Statistik KPI utama dashboard */
  DASHBOARD_STATS: `${API_BASE_URL}/api/dashboard/stats`,

  /** Data hasil clustering untuk visualisasi chart */
  CLUSTERING_RESULTS: `${API_BASE_URL}/api/clustering/results`,

  /** Ringkasan agregat per cluster */
  CLUSTERING_SUMMARY: `${API_BASE_URL}/api/clustering/summary`,

  /** Statistik EDA (Exploratory Data Analysis) dari dataset mentah */
  EDA_STATS: `${API_BASE_URL}/api/eda/stats`,

  /** Download dataset mentah (XLSX) */
  DOWNLOAD_RAW: `${API_BASE_URL}/api/download/raw`,

  /** Download data hasil clustering (CSV) */
  DOWNLOAD_CLUSTERED: `${API_BASE_URL}/api/download/clustered`,

  /** Visualisasi Peta Folium (HTML) */
  VISUALIZATION_MAP: `${API_BASE_URL}/api/visualizations/map`,
};
