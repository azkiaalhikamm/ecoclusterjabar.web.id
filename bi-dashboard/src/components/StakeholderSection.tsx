"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Building2,
  Landmark,
  Leaf,
  ShieldAlert,
  Users2,
} from "lucide-react";

const stakeholders = [
  {
    icon: Leaf,
    name: "Dinas Lingkungan Hidup",
    abbr: "DLH",
    role: "Pengelolaan Lingkungan",
    description:
      "Bertanggung jawab atas pengelolaan lingkungan yang terintegrasi, pemantauan kualitas ekosistem, serta penanganan dan distribusi sampah berbasis data.",
    responsibilities: ["Pengelolaan sampah", "Monitoring lingkungan", "Distribusi sampah"],
    color: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-600 dark:bg-emerald-400",
    bg: "from-emerald-500/15 to-emerald-600/5",
    border: "border-emerald-500/25",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
  },
  {
    icon: ShieldAlert,
    name: "BPBD Jawa Barat",
    abbr: "BPBD",
    role: "Mitigasi Risiko Banjir",
    description:
      "Berperan aktif dalam kesiapsiagaan bencana dan mitigasi risiko banjir melalui identifikasi wilayah rawan secara komprehensif dan sistematis.",
    responsibilities: ["Mitigasi banjir", "Wilayah rawan", "Kesiapsiagaan bencana"],
    color: "text-red-600 dark:text-red-400",
    dot: "bg-red-600 dark:bg-red-400",
    bg: "from-red-500/15 to-red-600/5",
    border: "border-red-500/25",
    iconBg: "bg-red-500/10 dark:bg-red-500/20",
  },
  {
    icon: Building2,
    name: "Pemerintah Daerah",
    abbr: "Pemda",
    role: "Smart Governance",
    description:
      "Fokus pada implementasi Smart Governance melalui pengambilan keputusan berbasis data untuk menetapkan prioritas wilayah dan koordinasi penanganan.",
    responsibilities: ["Pengambilan keputusan", "Prioritas wilayah", "Koordinasi penanganan"],
    color: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-600 dark:bg-blue-400",
    bg: "from-blue-500/15 to-blue-600/5",
    border: "border-blue-500/25",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
  },
  {
    icon: Landmark,
    name: "Bappeda / Perencana Kota",
    abbr: "Bappeda",
    role: "Pembangunan Berkelanjutan",
    description:
      "Merumuskan kebijakan jangka panjang dan mengintegrasikan data lingkungan untuk mendukung perencanaan pembangunan berkelanjutan di Jawa Barat.",
    responsibilities: ["Perencanaan pembangunan berkelanjutan", "Integrasi data lingkungan", "Kebijakan jangka panjang"],
    color: "text-violet-600 dark:text-violet-400",
    dot: "bg-violet-600 dark:bg-violet-400",
    bg: "from-violet-500/15 to-violet-600/5",
    border: "border-violet-500/25",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
  },
  {
    icon: Users2,
    name: "Masyarakat & Akademisi",
    abbr: "Akademisi",
    role: "Partisipasi Publik",
    description:
      "Mendorong peningkatan edukasi lingkungan, mendukung penelitian lanjutan terkait Business Intelligence, dan memperkuat partisipasi publik.",
    responsibilities: ["Edukasi lingkungan", "Penelitian lanjutan", "Partisipasi publik"],
    color: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-600 dark:bg-cyan-400",
    bg: "from-cyan-500/15 to-cyan-600/5",
    border: "border-cyan-500/25",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
  },
];

export default function StakeholderSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stakeholder" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50 dark:via-violet-950/5 to-transparent pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-5">
            <Users2 className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-300 tracking-widest uppercase">
              Key Stakeholders
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Pemangku{" "}
            <span className="gradient-text">Kepentingan Utama</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Stakeholder utama berperan dalam mendukung pengambilan keputusan berbasis data untuk pengelolaan banjir dan sampah di Provinsi Jawa Barat.
          </p>
        </motion.div>

        {/* Stakeholder Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative glass border ${s.border} rounded-3xl p-6 transition-all duration-300 overflow-hidden group shine-effect`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-30 dark:opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* Icon & Abbr */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <s.icon className={`w-7 h-7 ${s.color}`} />
                  </div>
                  <div>
                    <div className={`text-xs font-black ${s.color} tracking-widest uppercase mb-0.5`}>
                      {s.abbr}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{s.name}</h3>
                    <p className={`text-xs ${s.color} font-medium`}>{s.role}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed mb-5">{s.description}</p>

                {/* Responsibilities */}
                <div className="space-y-2">
                  {s.responsibilities.map((r) => (
                    <div key={r} className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
