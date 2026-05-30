import pandas as pd
from collections import Counter

df = pd.read_csv('data_final/hasil_cluster.csv')

# Mode cluster per region (most common across all years)
result = []
for name, grp in df.groupby('nama_kabupaten_kota'):
    counts = Counter(grp['cluster'].tolist())
    modal = counts.most_common(1)[0][0]
    modal_kat = grp[grp['cluster'] == modal]['kategori'].iloc[0]
    banjir_total = int(grp['jumlah_banjir'].sum())
    banjir_mean = round(grp['jumlah_banjir'].mean(), 1)
    sampah_total = round(grp['jumlah_sampah'].sum(), 2)
    sampah_mean = round(grp['jumlah_sampah'].mean(), 2)
    lat = grp['lat'].iloc[0]
    lon = grp['lon'].iloc[0]
    result.append({
        'nama': name,
        'cluster': modal,
        'kategori': modal_kat,
        'banjir_total': banjir_total,
        'banjir_mean': banjir_mean,
        'sampah_total': sampah_total,
        'sampah_mean': sampah_mean,
        'lat': lat,
        'lon': lon,
        'detail': dict(counts)
    })

print("=== DISTRIBUSI CLUSTER PER WILAYAH (Modal/Dominan) ===")
for r in result:
    print(f"{r['nama']:35s} cluster={r['cluster']} ({r['kategori']}) "
          f"banjir_total={r['banjir_total']} sampah_total={r['sampah_total']:.1f} "
          f"detail={r['detail']}")

print()
dist = Counter([r['cluster'] for r in result])
print("=== DISTRIBUSI CLUSTER ===", dist)

# Also compute using backend's approach: groupby nama+kategori, most rows per region
print()
print("=== DISTRIBUSI (GROUPBY NAMA+KATEGORI, pilih yg paling banyak rows) ===")
agg = df.groupby(['nama_kabupaten_kota','kategori']).agg(
    count=('jumlah_banjir','count'),
    banjir_sum=('jumlah_banjir','sum'),
    sampah_sum=('jumlah_sampah','sum'),
    lat=('lat','first'),
    lon=('lon','first')
).reset_index()

# Pick the kategori with most rows per region
best = agg.loc[agg.groupby('nama_kabupaten_kota')['count'].idxmax()]
dist2 = Counter(best['kategori'].tolist())
print("Distribusi:", dist2)
for _, r in best.iterrows():
    print(f"  {r['nama_kabupaten_kota']:35s} -> {r['kategori']} (count={r['count']})")

print()
print("=== OUTPUT FOR TSX (sorted by cluster) ===")
for _, r in best.sort_values(['kategori','nama_kabupaten_kota']).iterrows():
    clust_num = 2 if 'Tinggi' in r['kategori'] else (1 if 'Sedang' in r['kategori'] else 0)
    print(f'  {{ nama: "{r["nama_kabupaten_kota"]}", lat: {r["lat"]}, lon: {r["lon"]}, '
          f'cluster: {clust_num}, kategori: "{r["kategori"]}", '
          f'banjir: {int(r["banjir_sum"])}, sampah: {r["sampah_sum"]:.2f} }},')
