import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import os

from etl import PROCESSED_DATA_FILE

CLUSTERED_DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'hasil_cluster.csv')

KOORDINAT = {
    "KABUPATEN BOGOR": (-6.59, 106.79), "KABUPATEN SUKABUMI": (-6.92, 106.93),
    "KABUPATEN CIANJUR": (-6.82, 107.14), "KABUPATEN BANDUNG": (-7.02, 107.52),
    "KABUPATEN GARUT": (-7.21, 107.90), "KABUPATEN TASIKMALAYA": (-7.35, 108.22),
    "KABUPATEN CIAMIS": (-7.33, 108.35), "KABUPATEN KUNINGAN": (-6.98, 108.48),
    "KABUPATEN CIREBON": (-6.73, 108.55), "KABUPATEN MAJALENGKA": (-6.84, 108.23),
    "KABUPATEN SUMEDANG": (-6.85, 107.92), "KABUPATEN INDRAMAYU": (-6.33, 108.32),
    "KABUPATEN SUBANG": (-6.57, 107.75), "KABUPATEN PURWAKARTA": (-6.54, 107.45),
    "KABUPATEN KARAWANG": (-6.30, 107.30), "KABUPATEN BEKASI": (-6.24, 107.00),
    "KABUPATEN BANDUNG BARAT": (-6.86, 107.48), "KABUPATEN PANGANDARAN": (-7.69, 108.65),
    "KOTA BOGOR": (-6.60, 106.80), "KOTA SUKABUMI": (-6.91, 106.93),
    "KOTA BANDUNG": (-6.91, 107.61), "KOTA CIREBON": (-6.71, 108.56),
    "KOTA BEKASI": (-6.24, 106.99), "KOTA DEPOK": (-6.40, 106.82),
    "KOTA CIMAHI": (-6.88, 107.54), "KOTA TASIKMALAYA": (-7.33, 108.20),
    "KOTA BANJAR": (-7.37, 108.54)
}

def perform_clustering(df, n_clusters=3):
    """
    Melakukan K-Means Clustering dengan StandardScaler.
    """
    X = df[['jumlah_banjir', 'jumlah_sampah']]
    
    # 1. Normalisasi
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 2. Elbow Method (Inertia untuk k=1..10)
    elbow_data = []
    for k in range(1, 11):
        kmeans_temp = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans_temp.fit(X_scaled)
        elbow_data.append({"k": k, "inertia": kmeans_temp.inertia_})
        
    # Simpan data elbow ke CSV untuk dipakai frontend atau analisis
    elbow_df = pd.DataFrame(elbow_data)
    elbow_path = os.path.join(os.path.dirname(__file__), 'data', 'elbow_data.csv')
    elbow_df.to_csv(elbow_path, index=False)
    
    # 3. Fit model KMeans
    # Mencegah pemanggilan fit_predict berulang, cukup panggil fit lalu ambil labels_
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    clusters = kmeans.labels_
    
    # 4. Evaluasi Model
    from sklearn.metrics import davies_bouldin_score, calinski_harabasz_score
    score_silhouette = silhouette_score(X_scaled, clusters)
    score_dbi = davies_bouldin_score(X_scaled, clusters)
    score_chs = calinski_harabasz_score(X_scaled, clusters)
    
    eval_metrics = {
        "Silhouette Score": score_silhouette,
        "Davies Bouldin Index": score_dbi,
        "Calinski Harabasz Score": score_chs
    }
    
    df['cluster'] = clusters
    
    # 5. Urutkan label klaster berdasarkan sentroid (risiko)
    # Menghitung sentroid asli dari tiap cluster (berdasarkan data mentah / scaled)
    # Risiko paling rendah = centroid banjir + sampah terkecil
    cluster_stats = df.groupby('cluster')[['jumlah_banjir', 'jumlah_sampah']].mean()
    
    # Normalisasi untuk menjumlahkan skor secara adil
    cluster_stats['Risk_Score'] = (
        (cluster_stats['jumlah_sampah'] / cluster_stats['jumlah_sampah'].max()) +
        (cluster_stats['jumlah_banjir'] / cluster_stats['jumlah_banjir'].max())
    )
    
    # Urutkan dari nilai terkecil ke terbesar
    sorted_clusters = cluster_stats.sort_values('Risk_Score').index.tolist()
    
    # Mapping label risiko: 0 -> Rendah, 1 -> Sedang, 2 -> Tinggi
    label_map = {
        sorted_clusters[0]: "Wilayah Risiko Rendah",
        sorted_clusters[1]: "Wilayah Risiko Sedang",
        sorted_clusters[2]: "Wilayah Risiko Tinggi"
    }
    
    df["kategori"] = df["cluster"].map(label_map)
    
    return df, eval_metrics

def add_geospatial_data(df):
    """Tambahkan lat dan lon untuk visualisasi."""
    df["lat"] = df["nama_kabupaten_kota"].map(lambda x: KOORDINAT.get(x, (None, None))[0])
    df["lon"] = df["nama_kabupaten_kota"].map(lambda x: KOORDINAT.get(x, (None, None))[1])
    return df

def run_ml_pipeline():
    """
    Menjalankan alur Machine Learning (Clustering)
    """
    print("[ML] Membaca data hasil ETL...")
    if not os.path.exists(PROCESSED_DATA_FILE):
        print("[ML] File ETL tidak ditemukan. Menjalankan ETL terlebih dahulu...")
        from etl import run_etl
        df = run_etl()
    else:
        df = pd.read_csv(PROCESSED_DATA_FILE)
    print("[ML] Agregasi data per wilayah...")
    df_agg = df.groupby(['kode_provinsi', 'nama_provinsi', 'kode_kabupaten_kota', 'nama_kabupaten_kota']).agg({
        'jumlah_banjir': 'sum',
        'jumlah_sampah': 'sum'
    }).reset_index()

    print("[ML] Melakukan Clustering K-Means...")
    df, metrics = perform_clustering(df_agg, n_clusters=3)
    print(f"[ML] Evaluasi Model:")
    print(f"     - Silhouette Score       : {metrics['Silhouette Score']:.3f}")
    print(f"     - Davies Bouldin Index   : {metrics['Davies Bouldin Index']:.3f}")
    print(f"     - Calinski Harabasz Score: {metrics['Calinski Harabasz Score']:.3f}")
    
    print("[ML] Menambahkan data Geospasial...")
    df = add_geospatial_data(df)
    
    print(f"[ML] Menyimpan hasil clustering ke {CLUSTERED_DATA_FILE}...")
    df.to_csv(CLUSTERED_DATA_FILE, index=False)
    
    print("[ML] Membuat visualisasi dan peta interaktif...")
    try:
        import visualize
        visualize.main()
    except Exception as e:
        print(f"[ML] Gagal membuat visualisasi: {e}")
        
    print("[ML] Selesai!")
    
    return df

if __name__ == "__main__":
    run_ml_pipeline()
