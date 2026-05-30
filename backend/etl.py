import pandas as pd
import os

# ============================================================
# PATH KONFIGURASI
# ============================================================
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
RAW_DATA_FILE = os.path.join(DATA_DIR, 'gabungan_banjir_sampah_jabar_2015_2023.xlsx')

# Output Paths
PROCESSED_DATA_FILE = os.path.join(DATA_DIR, 'hasil_eda_etl.csv')
DIM_WAKTU_FILE = os.path.join(DATA_DIR, 'dim_waktu.csv')
DIM_LOKASI_FILE = os.path.join(DATA_DIR, 'dim_lokasi.csv')
FACT_BANJIR_SAMPAH_FILE = os.path.join(DATA_DIR, 'fact_banjir_sampah.csv')

# ============================================================
# FUNGSI ETL & DATA WAREHOUSE
# ============================================================

def load_raw_data() -> pd.DataFrame:
    """Memuat dataset mentah dari file lokal."""
    if not os.path.exists(RAW_DATA_FILE):
        raise FileNotFoundError(f"File data mentah tidak ditemukan: {RAW_DATA_FILE}")
    print("[Extract] Membaca data mentah dari Excel...")
    df = pd.read_excel(RAW_DATA_FILE)
    return df

def clean_and_transform(df: pd.DataFrame) -> pd.DataFrame:
    """
    Membersihkan data (Transformasi Dasar):
    1. Cek & hapus missing values
    2. Cek & hapus duplikat
    3. Validasi dan casting tipe data numerik
    """
    print("[Transform] Membersihkan missing value dan duplikat...")
    df = df.dropna()
    df = df.drop_duplicates()
    
    print("[Transform] Memilih kolom relevan dan casting tipe data...")
    df_clean = df[['kode_provinsi', 'nama_provinsi',
                   'kode_kabupaten_kota', 'nama_kabupaten_kota',
                   'tahun', 'jumlah_banjir', 'jumlah_sampah']].copy()
                   
    # Validasi tipe data numerik
    df_clean['tahun'] = df_clean['tahun'].astype(int)
    df_clean['jumlah_banjir'] = df_clean['jumlah_banjir'].astype(int)
    df_clean['jumlah_sampah'] = df_clean['jumlah_sampah'].astype(float)
    
    return df_clean

def build_data_warehouse(df_clean: pd.DataFrame):
    """
    Membangun struktur Data Warehouse dengan Skema Bintang (Star Schema).
    Menghasilkan 2 Tabel Dimensi dan 1 Tabel Fakta.
    """
    print("[Data Warehouse] Membangun Dimensi Waktu (dim_waktu)...")
    dim_waktu = df_clean[['tahun']].drop_duplicates().reset_index(drop=True)
    dim_waktu['id_waktu'] = dim_waktu.index + 1
    dim_waktu = dim_waktu[['id_waktu', 'tahun']]
    
    print("[Data Warehouse] Membangun Dimensi Lokasi (dim_lokasi)...")
    dim_lokasi = df_clean[['kode_provinsi', 'nama_provinsi',
                           'kode_kabupaten_kota', 'nama_kabupaten_kota']].drop_duplicates().reset_index(drop=True)
    dim_lokasi['id_lokasi'] = dim_lokasi.index + 1
    dim_lokasi = dim_lokasi[['id_lokasi', 'kode_provinsi', 'nama_provinsi', 
                             'kode_kabupaten_kota', 'nama_kabupaten_kota']]
    
    print("[Data Warehouse] Membangun Tabel Fakta (fact_banjir_sampah)...")
    # Merge dengan dim_waktu
    fact = df_clean.merge(dim_waktu, on='tahun')
    # Merge dengan dim_lokasi
    fact = fact.merge(dim_lokasi, on=['kode_provinsi', 'nama_provinsi', 
                                      'kode_kabupaten_kota', 'nama_kabupaten_kota'])
    
    # Pilih dan susun kolom fakta
    fact_banjir_sampah = fact[['id_waktu', 'id_lokasi', 'jumlah_banjir', 'jumlah_sampah']].copy()
    fact_banjir_sampah.insert(0, 'id_fakta', range(1, len(fact_banjir_sampah) + 1))
    
    return dim_waktu, dim_lokasi, fact_banjir_sampah

def save_outputs(df_clean, dim_waktu, dim_lokasi, fact_banjir_sampah):
    """Menyimpan seluruh tabel ke dalam CSV."""
    print("[Load] Menyimpan dataset bersih dan tabel Data Warehouse ke CSV...")
    df_clean.to_csv(PROCESSED_DATA_FILE, index=False)
    dim_waktu.to_csv(DIM_WAKTU_FILE, index=False)
    dim_lokasi.to_csv(DIM_LOKASI_FILE, index=False)
    fact_banjir_sampah.to_csv(FACT_BANJIR_SAMPAH_FILE, index=False)
    print(f"[Load] File berhasil disimpan di direktori: {DATA_DIR}")

def run_etl():
    """Alur utama ETL dan pembuatan Data Warehouse."""
    print("="*50)
    print("Memulai Proses ETL & Data Warehouse")
    print("="*50)
    
    # 1. Extract
    df_raw = load_raw_data()
    
    # 2. Transform (Pembersihan Data Dasar)
    df_clean = clean_and_transform(df_raw)
    
    # 3. Transform (Pembuatan Star Schema)
    dim_waktu, dim_lokasi, fact_banjir_sampah = build_data_warehouse(df_clean)
    
    # 4. Load (Simpan ke CSV)
    save_outputs(df_clean, dim_waktu, dim_lokasi, fact_banjir_sampah)
    
    print("="*50)
    print("Proses ETL selesai dengan sukses!")
    print("="*50)
    
    return df_clean

if __name__ == "__main__":
    run_etl()
