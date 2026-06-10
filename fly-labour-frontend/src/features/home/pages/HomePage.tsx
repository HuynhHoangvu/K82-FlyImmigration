import HeroBanner from "@features/home/components/HeroBanner";
import FlashSaleJobs from "@features/home/components/FlashSaleJobs";
import CategoriesSection from "@features/home/components/CategoriesSection";
import LatestJobsSection from "@features/home/components/LatestJobsSection";
import NewsSection from "@features/home/components/NewsSection";
import EmployerCTASection from "@features/home/components/EmployerCTASection";
import EnglishTestCtaRow from "@features/home/components/EnglishTestCtaRow";
import AboutSection from "@features/home/components/AboutSection";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <FlashSaleJobs />
      <CategoriesSection />
      <LatestJobsSection />
      <AboutSection />
      <EmployerCTASection />
      <NewsSection />
      <EnglishTestCtaRow />
    </main>
  );
}
