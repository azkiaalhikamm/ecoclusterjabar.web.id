import pandas as pd
from collections import Counter

df = pd.read_csv('data_final/hasil_cluster.csv')

# Use MAXIMUM cluster per region (peak risk - academically valid for risk map)
agg = df.groupby('nama_kabupaten_kota').agg(
    cluster_max=('cluster', 'max'),
    banjir_total=('jumlah_banjir', 'sum'),
    sampah_total=('jumlah_sampah', 'sum'),
    lat=('lat', 'first'),
    lon=('lon', 'first')
).reset_index()

label_map = {0: 'Wilayah Risiko Rendah', 1: 'Wilayah Risiko Sedang', 2: 'Wilayah Risiko Tinggi'}
agg['kategori'] = agg['cluster_max'].map(label_map)

print('Distribusi:', Counter(agg['kategori'].tolist()))
print()
print('=== TSX DATA (sorted by cluster) ===')
for _, r in agg.sort_values(['cluster_max','nama_kabupaten_kota']).iterrows():
    print(f'  {{ nama: "{r["nama_kabupaten_kota"]}", lat: {r["lat"]}, lon: {r["lon"]}, cluster: {int(r["cluster_max"])}, kategori: "{r["kategori"]}", banjir: {int(r["banjir_total"])}, sampah: {r["sampah_total"]:.2f} }},')
