import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import KPISection from "@/components/KPISection";
import StakeholderSection from "@/components/StakeholderSection";
import BusinessQuestionSection from "@/components/BusinessQuestionSection";
import TimelineSection from "@/components/TimelineSection";
import EDASection from "@/components/EDASection";
import DataWarehouseSection from "@/components/DataWarehouseSection";
import ClusteringSection from "@/components/ClusteringSection";
import InteractiveMapSection from "@/components/InteractiveMapSection";
import DashboardPreview from "@/components/DashboardPreview";
import DataStorytellingSection from "@/components/DataStorytellingSection";
import DecisionMakingSection from "@/components/DecisionMakingSection";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <KPISection />
      <StakeholderSection />
      <BusinessQuestionSection />
      <TimelineSection />
      <EDASection />
      <DataWarehouseSection />
      <ClusteringSection />
      <InteractiveMapSection />
      <DashboardPreview />
      <DataStorytellingSection />
      <DecisionMakingSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
