"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BarChart2,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";


const navLinks = [
  { href: "#about", label: "About" },
  { href: "#kpi", label: "KPI" },
  { href: "#timeline", label: "Timeline" },
  { href: "#eda", label: "EDA" },
  { href: "#data-warehouse", label: "Methodology" },
  { href: "#clustering", label: "Clustering" },
  { href: "#peta-interaktif", label: "Peta" },
  { href: "#download", label: "Download Data" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (val) => {
      setScrolled(val > 20);
    });
    return () => unsub();
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-2xl shadow-blue-950/20 dark:shadow-blue-950/20"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-blue-600/30">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-sm group-hover:bg-blue-500/40 transition-all" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                BI<span className="gradient-text"> Dashboard</span>
              </span>
              <p className="text-xs text-slate-500 -mt-0.5">Jawa Barat Smart City</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 font-medium tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="#dashboard"
              className="flex items-center gap-2 px-5 py-2.5 gradient-bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" />
              View Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg glass text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-4 px-3 space-y-1 border-t border-slate-200 dark:border-white/5 mt-2 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-2xl mb-4 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-3">
              <Link
                href="#dashboard"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 gradient-bg-primary text-white text-sm font-semibold rounded-xl"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
