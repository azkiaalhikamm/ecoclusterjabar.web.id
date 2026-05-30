"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  AlertTriangle,
  Brain,
  Building2,
  Database,
  Globe,
  Layers,
  Target,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: AlertTriangle,
    title: "Krisis Banjir",
    description:
      "Jawa Barat mengalami ratusan kejadian banjir setiap tahun yang berdampak pada jutaan warga dan infrastruktur daerah.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20 dark:border-amber-500/20",
    borderLight: "border-amber-300",
  },
  {
    icon: Database,
    title: "Masalah Sampah",
    description:
      "Produksi sampah yang terus meningkat di berbagai wilayah memperburuk kualitas lingkungan dan memicu risiko bencana.",
    color: "text-red-600 dark:text-red-400",
    bg: "from-red-500/10 to-red-600/5",
    border: "border-red-500/20 dark:border-red-500/20",
    borderLight: "border-red-300",
  },
  {
    icon: Brain,
    title: "K-Means Clustering",
    description:
      "Metode machine learning unsupervised digunakan untuk mengelompokkan wilayah berdasarkan tingkat banjir dan volume sampah secara objektif.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "from-violet-500/10 to-violet-600/5",
    border: "border-violet-500/20 dark:border-violet-500/20",
    borderLight: "border-violet-300",
  },
  {
    icon: Target,
    title: "Prioritas Penanganan",
    description:
      "Mengidentifikasi wilayah dengan risiko tinggi agar pemerintah dapat mengalokasikan sumber daya mitigasi secara tepat sasaran.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-500/20 dark:border-blue-500/20",
    borderLight: "border-blue-300",
  },
  {
    icon: Globe,
    title: "Smart City Integration",
    description:
      "Mengintegrasikan Dashboard Business Intelligence ke dalam ekosistem Smart City Jawa Barat untuk mendukung Smart Governance dan Smart Environment.",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "from-cyan-500/10 to-cyan-600/5",
    border: "border-cyan-500/20 dark:border-cyan-500/20",
    borderLight: "border-cyan-300",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Policy",
    description:
      "Menyediakan rekomendasi kebijakan berbasis data (data-driven decision making) yang terukur dan dapat diimplementasikan secara strategis.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/20 dark:border-emerald-500/20",
    borderLight: "border-emerald-300",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-5">
            <Building2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 tracking-widest uppercase">
              About The Project
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Latar Belakang &{" "}
            <span className="gradient-text">Konteks Masalah</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-base leading-relaxed">
            Provinsi Jawa Barat menghadapi tantangan kompleks dalam pengelolaan lingkungan 
            hidup di tengah pesatnya laju urbanisasi. Tingginya frekuensi kejadian banjir
            dan volume produksi sampah yang terus meningkat menuntut pendekatan strategis 
            berbasis data untuk mendukung formulasi kebijakan yang proaktif dan terukur.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left - Context */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass border border-slate-200 dark:border-white/8 rounded-3xl p-8 card-glow shine-effect"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Konteks Penelitian</h3>
            </div>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              <p>
                Platform ini dikembangkan sebagai bagian dari implementasi{" "}
                <span className="text-slate-900 dark:text-white font-semibold">Business Intelligence</span> dalam
                mendukung ekosistem <span className="text-blue-600 dark:text-blue-400 font-semibold">Smart City</span>{" "}
                Provinsi Jawa Barat, khususnya pada pilar <span className="text-slate-900 dark:text-white font-semibold">Smart Environment</span> dan <span className="text-slate-900 dark:text-white font-semibold">Smart Governance</span>.
              </p>
              <p>
                Data yang digunakan bersumber dari{" "}
                <span className="text-cyan-400 font-semibold">Open Data Jawa Barat</span>{" "}
                yang mencakup dua dimensi fundamental: rekapan historis kejadian bencana banjir dan volume
                penanganan sampah di wilayah kabupaten/kota di Provinsi Jawa Barat.
              </p>
              <p>
                Melalui pendekatan analitik <span className="text-violet-600 dark:text-violet-400 font-semibold">K-Means Clustering</span>,
                metode machine learning unsupervised digunakan untuk mengelompokkan wilayah berdasarkan tingkat banjir dan volume sampah secara objektif.
                Hasil segmentasi ini membagi wilayah ke dalam kategori risiko{" "}
                <span className="text-red-600 dark:text-red-400">Tinggi</span>,{" "}
                <span className="text-amber-600 dark:text-amber-400">Sedang</span>, dan{" "}
                <span className="text-emerald-600 dark:text-emerald-400">Rendah</span>.
              </p>
              <p>
                Dashboard ini dikembangkan untuk mendukung <span className="text-emerald-600 dark:text-emerald-400 font-semibold">data-driven decision making</span> dalam pengelolaan lingkungan di Provinsi Jawa Barat, memfasilitasi pemangku kepentingan dalam merumuskan strategi mitigasi risiko banjir dan optimalisasi pengelolaan sampah.
              </p>
            </div>
          </motion.div>

          {/* Right - Objectives */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="glass border border-slate-200 dark:border-white/8 rounded-3xl p-8 card-glow shine-effect"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-violet-500 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tujuan Analisis</h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  num: "01",
                  text: "Mengidentifikasi wilayah prioritas untuk mitigasi risiko banjir dan pengelolaan sampah berdasarkan data historis.",
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  num: "02",
                  text: "Membangun model K-Means Clustering yang optimal untuk segmentasi wilayah berdasarkan profil kerawanan lingkungan.",
                  color: "text-violet-600 dark:text-violet-400",
                },
                {
                  num: "03",
                  text: "Menyediakan Dashboard Business Intelligence interaktif yang komprehensif bagi pemangku kepentingan dan masyarakat.",
                  color: "text-cyan-600 dark:text-cyan-400",
                },
                {
                  num: "04",
                  text: "Menghasilkan rekomendasi kebijakan berbasis data (data-driven) untuk alokasi sumber daya yang lebih presisi dan efisien.",
                  color: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  num: "05",
                  text: "Mendukung percepatan implementasi Smart Environment dan Smart Governance melalui tata kelola berbasis analitik cerdas.",
                  color: "text-amber-600 dark:text-amber-400",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className={`text-xs font-black ${item.color} mt-1 min-w-[28px]`}>
                    {item.num}
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`relative glass border ${feature.border} rounded-2xl p-6 transition-all duration-300 card-glow-hover shine-effect overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-40 dark:opacity-50`} />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
