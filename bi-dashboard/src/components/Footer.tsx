"use client";
import Link from "next/link";
import {
  BarChart2,
  ExternalLink,
  FileText,
  ArrowUpRight,
} from "lucide-react";

const links = [
  { label: "Dashboard Preview", icon: ExternalLink, href: "#dashboard", external: false },
  { label: "Download Data", icon: FileText, href: "#download", external: false },
];

const navLinks = [
  { label: "About", href: "#about" },
  { label: "KPI", href: "#kpi" },
  { label: "Stakeholder", href: "#stakeholder" },
  { label: "Business Questions", href: "#business-questions" },
  { label: "Timeline", href: "#timeline" },
  { label: "Data Warehouse", href: "#data-warehouse" },
  { label: "Clustering", href: "#clustering" },
  { label: "Dashboard", href: "#dashboard" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 dark:border-white/5 pt-16 pb-8">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100/80 dark:to-slate-950/50 pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Top */}
        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-blue-600/30">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 dark:text-white">BI Dashboard</span>
                <p className="text-xs text-slate-500 dark:text-slate-500">Jawa Barat Smart City</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed mb-6 max-w-xs">
              Platform Business Intelligence untuk analisis dan klasterisasi wilayah
              berdasarkan tingkat banjir dan produksi sampah di Jawa Barat.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "Python", "K-Means", "FastAPI", "Pandas"].map((tech) => (
                <span key={tech} className="text-xs px-2.5 py-1 rounded-lg glass border border-slate-200 dark:border-white/8 text-slate-600 dark:text-slate-500">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Navigation</h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Resources</h4>
            <div className="space-y-3">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg glass border border-slate-200 dark:border-white/8 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                    <link.icon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors flex items-center gap-1">
                    {link.label}
                    {link.external && <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-600 text-center">
            © 2025 BI Dashboard Jawa Barat ·  Business Intelligence · Semester 6
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-700 text-center">
            Data source:{" "}
            <span className="text-slate-600 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-400 transition-colors cursor-pointer">
              Open Data Jawa Barat
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
