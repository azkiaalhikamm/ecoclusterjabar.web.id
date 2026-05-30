from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import numpy as np
import os

# ============================================================
# PATH KONFIGURASI
# ============================================================
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'hasil_cluster.csv')
RAW_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'hasil_eda_etl.csv')

# ============================================================
# CACHE GLOBAL — Lazy loaded, TIDAK pre-load saat startup
# Data hanya dibaca saat pertama kali endpoint dipanggil
# Ini menghemat RAM saat startup secara drastis
# ============================================================
_cache: dict = {
    "raw_df": None,
    "clustered_df": None,
}

def get_raw_df() -> pd.DataFrame:
    """Lazy load DataFrame mentah dari Excel — hanya dibaca sekali."""
    if _cache["raw_df"] is None:
        if not os.path.exists(RAW_DATA_PATH):
            raise FileNotFoundError("Dataset mentah tidak ditemukan")
        print("[Cache] Membaca file CSV mentah (pertama kali diperlukan)...")
        # Hanya load kolom yang diperlukan untuk hemat memori
        _cache["raw_df"] = pd.read_csv(
            RAW_DATA_PATH,
            usecols=['nama_kabupaten_kota', 'tahun', 'jumlah_banjir', 'jumlah_sampah']
        )
        print(f"[Cache] Raw data loaded: {len(_cache['raw_df'])} rows, "
              f"{_cache['raw_df'].memory_usage(deep=True).sum() / 1024 / 1024:.1f} MB")
    return _cache["raw_df"]

def get_clustered_df() -> pd.DataFrame:
    """Lazy load DataFrame hasil clustering dari CSV — hanya dibaca sekali."""
    if _cache["clustered_df"] is None:
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError("Data clustering tidak ditemukan. Jalankan pipeline ML terlebih dahulu.")
        print("[Cache] Membaca file CSV clustering (pertama kali diperlukan)...")
        _cache["clustered_df"] = pd.read_csv(DATA_PATH)
        print(f"[Cache] Clustered data loaded: {len(_cache['clustered_df'])} rows")
    return _cache["clustered_df"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle: Jalankan ML pipeline HANYA jika CSV belum ada.
    TIDAK pre-load data ke RAM saat startup — hemat memori signifikan.
    """
    print("=" * 50)
    print("BI Dashboard API - Inisialisasi...")
    
    if not os.path.exists(DATA_PATH):
        print("[Pipeline] CSV belum ada. ML Pipeline otomatis dinonaktifkan di update terbaru.")
    else:
        print("[Pipeline] CSV sudah ada, skip pipeline. Startup cepat!")
    
    print("[Ready] API siap digunakan. Data akan di-load saat pertama kali dipanggil.")
    print("=" * 50)
    
    yield
    
    # Shutdown: bebaskan memori
    _cache["raw_df"] = None
    _cache["clustered_df"] = None
    print("BI Dashboard API ditutup.")


app = FastAPI(
    title="BI Dashboard API - Analisis Banjir & Sampah Jawa Barat",
    description="API untuk menyediakan hasil K-Means Clustering pada data banjir dan pengelolaan sampah di Jawa Barat.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"message": "BI Dashboard API aktif", "status": "ok"}


@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    """KPI utama untuk dashboard."""
    try:
        df = get_clustered_df()
    except FileNotFoundError as e:
        return {"error": str(e)}

    total_regions = len(df['nama_kabupaten_kota'].unique())
    high_risk_regions = int(len(df[df['kategori'] == 'Wilayah Risiko Tinggi']['nama_kabupaten_kota'].unique()))
    avg_waste = float(df['jumlah_sampah'].mean())
    avg_flood = float(df['jumlah_banjir'].mean())

    return {
        "total_regions": total_regions,
        "high_risk_regions": high_risk_regions,
        "average_waste_tons": round(avg_waste, 2),
        "average_flood_frequency": round(avg_flood, 2)
    }


@app.get("/api/clustering/results")
def get_clustering_results():
    """Data hasil clustering untuk visualisasi frontend."""
    try:
        df = get_clustered_df()
    except FileNotFoundError as e:
        return {"error": str(e)}

    chart_data = df[['nama_kabupaten_kota', 'jumlah_sampah', 'jumlah_banjir', 'cluster', 'kategori']].copy()
    chart_data['kategori'] = chart_data['kategori'].str.replace('Wilayah Risiko ', '')
    chart_data = chart_data.rename(columns={
        'nama_kabupaten_kota': 'region',
        'jumlah_sampah': 'wasteVolume',
        'jumlah_banjir': 'floodFrequency',
        'cluster': 'cluster',
        'kategori': 'riskLevel',
    })
    chart_data['wasteVolume'] = chart_data['wasteVolume'].round(2)
    chart_data['floodFrequency'] = chart_data['floodFrequency'].round(2)
    chart_data['cluster'] = chart_data['cluster'].astype(int)

    return {"data": chart_data.to_dict(orient='records')}

@app.get("/api/clustering/elbow")
def get_clustering_elbow():
    """Data Elbow Method untuk visualisasi jumlah cluster optimal."""
    elbow_path = os.path.join(os.path.dirname(__file__), 'data', 'elbow_data.csv')
    if not os.path.exists(elbow_path):
        return {"error": "Data elbow tidak ditemukan."}
    
    elbow_df = pd.read_csv(elbow_path)
    return {"data": elbow_df.to_dict(orient='records')}



@app.get("/api/clustering/summary")
def get_clustering_summary():
    """Ringkasan agregat per cluster."""
    try:
        df = get_clustered_df()
    except FileNotFoundError as e:
        return {"error": str(e)}

    df['Tingkat_Risiko'] = df['kategori'].str.replace('Wilayah Risiko ', '')
    summary = df.groupby('Tingkat_Risiko').agg(
        Region_Count=('nama_kabupaten_kota', 'nunique'),
        jumlah_sampah=('jumlah_sampah', 'mean'),
        jumlah_banjir=('jumlah_banjir', 'mean')
    ).reset_index()

    return {"summary": summary.to_dict(orient='records')}


@app.get("/api/eda/stats")
def get_eda_stats():
    """
    EDA: statistik deskriptif, tren tahunan, top/bottom wilayah,
    distribusi data, dan korelasi dari dataset mentah.
    """
    try:
        df = get_raw_df()
    except FileNotFoundError as e:
        return {"error": str(e)}

    # 1. Statistik Deskriptif
    descriptive = {
        "banjir": {
            "mean": round(float(df['jumlah_banjir'].mean()), 2),
            "median": round(float(df['jumlah_banjir'].median()), 2),
            "std": round(float(df['jumlah_banjir'].std()), 2),
            "min": int(df['jumlah_banjir'].min()),
            "max": int(df['jumlah_banjir'].max()),
            "total_records": int(len(df)),
        },
        "sampah": {
            "mean": round(float(df['jumlah_sampah'].mean()), 2),
            "median": round(float(df['jumlah_sampah'].median()), 2),
            "std": round(float(df['jumlah_sampah'].std()), 2),
            "min": round(float(df['jumlah_sampah'].min()), 2),
            "max": round(float(df['jumlah_sampah'].max()), 2),
            "total_records": int(len(df)),
        }
    }

    # 2. Tren Tahunan
    yearly = df.groupby('tahun').agg(
        total_banjir=('jumlah_banjir', 'sum'),
        rata_banjir=('jumlah_banjir', 'mean'),
        total_sampah=('jumlah_sampah', 'sum'),
        rata_sampah=('jumlah_sampah', 'mean'),
    ).reset_index()

    trend_data = [
        {
            "tahun": int(row['tahun']),
            "total_banjir": int(row['total_banjir']),
            "rata_banjir": round(float(row['rata_banjir']), 2),
            "total_sampah": round(float(row['total_sampah']), 0),
            "rata_sampah": round(float(row['rata_sampah']), 2),
        }
        for _, row in yearly.iterrows()
    ]

    # 3. Top 5 & Bottom 5 Wilayah
    agg = df.groupby('nama_kabupaten_kota').agg(
        jumlah_banjir=('jumlah_banjir', 'mean'),
        jumlah_sampah=('jumlah_sampah', 'mean'),
    ).reset_index()

    def to_list(sub_df, col):
        return [{"region": r['nama_kabupaten_kota'], "value": round(float(r[col]), 2)} for _, r in sub_df.iterrows()]

    top_bottom = {
        "top_banjir": to_list(agg.nlargest(5, 'jumlah_banjir'), 'jumlah_banjir'),
        "bottom_banjir": to_list(agg.nsmallest(5, 'jumlah_banjir'), 'jumlah_banjir'),
        "top_sampah": to_list(agg.nlargest(5, 'jumlah_sampah'), 'jumlah_sampah'),
        "bottom_sampah": to_list(agg.nsmallest(5, 'jumlah_sampah'), 'jumlah_sampah'),
    }

    # 4. Distribusi Data
    banjir_bins = [0, 5, 10, 15, 20, 30, 50, 100]
    banjir_labels = ["0-5", "6-10", "11-15", "16-20", "21-30", "31-50", "51+"]
    banjir_hist = pd.cut(df['jumlah_banjir'], bins=banjir_bins, labels=banjir_labels, right=True).value_counts().sort_index()

    sampah_bins = [0, 50000, 100000, 200000, 400000, 700000, 1500000]
    sampah_labels = ["<50rb", "50-100rb", "100-200rb", "200-400rb", "400-700rb", "700rb+"]
    sampah_hist = pd.cut(df['jumlah_sampah'], bins=sampah_bins, labels=sampah_labels, right=True).value_counts().sort_index()

    # 5. Korelasi
    correlation = round(float(df['jumlah_banjir'].corr(df['jumlah_sampah'])), 4)
    scatter_data = [
        {"region": r['nama_kabupaten_kota'], "banjir": round(float(r['jumlah_banjir']), 2), "sampah": round(float(r['jumlah_sampah']), 0)}
        for _, r in agg.iterrows()
    ]

    return {
        "descriptive": descriptive,
        "trend": trend_data,
        "top_bottom": top_bottom,
        "distribution": {
            "banjir": [{"range": str(k), "count": int(v)} for k, v in banjir_hist.items()],
            "sampah": [{"range": str(k), "count": int(v)} for k, v in sampah_hist.items()],
        },
        "correlation": {
            "value": correlation,
            "scatter": scatter_data,
        }
    }


from fastapi.responses import HTMLResponse

@app.get("/api/download/raw")
def download_raw_data():
    """Download dataset mentah (XLSX)."""
    if os.path.exists(RAW_DATA_PATH):
        return FileResponse(
            RAW_DATA_PATH,
            media_type="text/csv",
            filename="hasil_eda_etl.csv"
        )
    return {"error": "File tidak ditemukan"}


@app.get("/api/download/clustered")
def download_clustered_data():
    """Download data hasil clustering (CSV)."""
    if os.path.exists(DATA_PATH):
        return FileResponse(DATA_PATH, media_type="text/csv", filename="hasil_cluster.csv")
    return {"error": "File tidak ditemukan"}

@app.get("/api/visualizations/map", response_class=HTMLResponse)
def get_interactive_map():
    """Menyajikan Peta Interaktif Folium dalam bentuk HTML."""
    map_path = os.path.join(os.path.dirname(__file__), 'visualizations', 'map_cluster.html')
    if os.path.exists(map_path):
        with open(map_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        return HTMLResponse(content=html_content, status_code=200)
    return HTMLResponse(content="<h3>Peta Interaktif belum dibuat. Jalankan pipeline ML terlebih dahulu.</h3>", status_code=404)

@app.get("/api/visualizations/{image_name}")
def get_visualization_image(image_name: str):
    """Menyajikan gambar visualisasi statis (PNG)."""
    img_path = os.path.join(os.path.dirname(__file__), 'visualizations', image_name)
    if os.path.exists(img_path) and image_name.endswith('.png'):
        return FileResponse(img_path, media_type="image/png")
    return {"error": "Gambar visualisasi tidak ditemukan."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
