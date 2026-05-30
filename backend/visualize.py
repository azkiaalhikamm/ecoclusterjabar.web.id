import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import folium

# Configuration
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, 'data')
VIS_DIR = os.path.join(BASE_DIR, 'visualizations')
RAW_DATA_FILE = os.path.join(DATA_DIR, 'hasil_eda_etl.csv')
CLUSTERED_DATA_FILE = os.path.join(DATA_DIR, 'hasil_cluster.csv')
MAP_OUTPUT_FILE = os.path.join(VIS_DIR, 'map_cluster.html')

# Modern styling for seaborn
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams.update({
    'font.size': 12,
    'axes.titlesize': 16,
    'axes.labelsize': 14,
    'xtick.labelsize': 12,
    'ytick.labelsize': 12,
    'figure.figsize': (10, 6)
})

def ensure_dirs():
    if not os.path.exists(VIS_DIR):
        os.makedirs(VIS_DIR)

def plot_histograms(df_raw):
    print("[Visualisasi] Membangun Histogram Banjir...")
    plt.figure()
    sns.histplot(df_raw['jumlah_banjir'], bins=20, kde=True, color='teal')
    plt.title('Distribusi Jumlah Banjir di Jawa Barat')
    plt.xlabel('Jumlah Banjir')
    plt.ylabel('Frekuensi')
    plt.tight_layout()
    plt.savefig(os.path.join(VIS_DIR, 'hist_banjir.png'), dpi=300)
    plt.close()

    print("[Visualisasi] Membangun Histogram Sampah...")
    plt.figure()
    sns.histplot(df_raw['jumlah_sampah'], bins=20, kde=True, color='coral')
    plt.title('Distribusi Jumlah Sampah di Jawa Barat')
    plt.xlabel('Jumlah Sampah (Ton)')
    plt.ylabel('Frekuensi')
    plt.tight_layout()
    plt.savefig(os.path.join(VIS_DIR, 'hist_sampah.png'), dpi=300)
    plt.close()

def plot_trends(df_raw):
    print("[Visualisasi] Membangun Tren Tahunan...")
    # Agregasi data per tahun
    trend_df = df_raw.groupby('tahun').agg({'jumlah_banjir': 'sum', 'jumlah_sampah': 'sum'}).reset_index()

    # Tren Banjir
    plt.figure()
    sns.lineplot(data=trend_df, x='tahun', y='jumlah_banjir', marker='o', color='teal', linewidth=2.5)
    plt.title('Tren Total Banjir per Tahun')
    plt.xlabel('Tahun')
    plt.ylabel('Total Banjir')
    plt.xticks(trend_df['tahun'].astype(int))
    plt.tight_layout()
    plt.savefig(os.path.join(VIS_DIR, 'tren_banjir.png'), dpi=300)
    plt.close()

    # Tren Sampah
    plt.figure()
    sns.lineplot(data=trend_df, x='tahun', y='jumlah_sampah', marker='o', color='coral', linewidth=2.5)
    plt.title('Tren Total Sampah per Tahun')
    plt.xlabel('Tahun')
    plt.ylabel('Total Sampah (Ton)')
    plt.xticks(trend_df['tahun'].astype(int))
    plt.tight_layout()
    plt.savefig(os.path.join(VIS_DIR, 'tren_sampah.png'), dpi=300)
    plt.close()

def plot_scatter_clusters(df_cluster):
    print("[Visualisasi] Membangun Scatter Plot Clustering...")
    plt.figure()
    
    # Custom color palette matching the risk levels
    color_dict = {
        'Wilayah Risiko Rendah': 'green',
        'Wilayah Risiko Sedang': 'orange',
        'Wilayah Risiko Tinggi': 'red'
    }
    
    sns.scatterplot(
        data=df_cluster, 
        x='jumlah_sampah', 
        y='jumlah_banjir', 
        hue='kategori', 
        palette=color_dict,
        s=100, 
        alpha=0.8,
        edgecolor='black'
    )
    plt.title('Scatter Plot Clustering (Sampah vs Banjir)')
    plt.xlabel('Jumlah Sampah (Ton)')
    plt.ylabel('Jumlah Banjir')
    plt.legend(title='Kategori Risiko')
    plt.tight_layout()
    plt.savefig(os.path.join(VIS_DIR, 'scatter_clustering.png'), dpi=300)
    plt.close()

def create_folium_map(df_cluster):
    print("[Visualisasi] Membangun Peta Interaktif Folium...")
    # Pusat peta rata-rata di Jawa Barat
    map_center = [-6.9, 107.6] 
    m = folium.Map(location=map_center, zoom_start=8, tiles='CartoDB positron')

    # Aggregasi data per kabupaten/kota supaya setiap wilayah hanya muncul 1 popup
    df_agg = df_cluster.groupby(['nama_kabupaten_kota', 'kategori']).agg({
        'jumlah_banjir': 'sum',
        'jumlah_sampah': 'sum',
        'lat': 'first',
        'lon': 'first'
    }).reset_index()

    df_agg = df_agg.dropna(subset=['lat', 'lon'])

    color_dict = {
        'Wilayah Risiko Rendah': 'green',
        'Wilayah Risiko Sedang': 'orange',
        'Wilayah Risiko Tinggi': 'red'
    }

    for idx, row in df_agg.iterrows():
        cat = row['kategori']
        color = color_dict.get(cat, 'gray')
        
        # HTML Content for popup
        html = f"""
        <div style="font-family: Arial, sans-serif; width: 220px;">
            <h4 style="margin-bottom: 5px; color: #333;">{row['nama_kabupaten_kota']}</h4>
            <hr style="margin: 5px 0;">
            <p style="margin: 5px 0;"><b>Kategori:</b> <span style="color: {color}; font-weight: bold;">{cat}</span></p>
            <p style="margin: 5px 0;"><b>Total Banjir:</b> {row['jumlah_banjir']}</p>
            <p style="margin: 5px 0;"><b>Total Sampah:</b> {row['jumlah_sampah']:,.2f} Ton</p>
        </div>
        """
        iframe = folium.IFrame(html=html, width=250, height=140)
        popup = folium.Popup(iframe, max_width=250)

        folium.CircleMarker(
            location=[row['lat'], row['lon']],
            radius=10,
            popup=popup,
            tooltip=row['nama_kabupaten_kota'],
            color=color,
            fill=True,
            fill_color=color,
            fill_opacity=0.7
        ).add_to(m)

    m.save(MAP_OUTPUT_FILE)
    print(f"[Visualisasi] Peta berhasil disimpan ke: {MAP_OUTPUT_FILE}")

def main():
    ensure_dirs()
    
    if not os.path.exists(RAW_DATA_FILE):
        print(f"[Error] File mentah tidak ditemukan: {RAW_DATA_FILE}")
        return
        
    if not os.path.exists(CLUSTERED_DATA_FILE):
        print(f"[Error] File clustering tidak ditemukan: {CLUSTERED_DATA_FILE}")
        return

    df_raw = pd.read_csv(RAW_DATA_FILE)
    df_cluster = pd.read_csv(CLUSTERED_DATA_FILE)

    plot_histograms(df_raw)
    plot_trends(df_raw)
    plot_scatter_clusters(df_cluster)
    create_folium_map(df_cluster)

    print("[Visualisasi] Selesai! Semua file berhasil dibuat.")

if __name__ == "__main__":
    main()
