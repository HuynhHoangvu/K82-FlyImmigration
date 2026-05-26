import HeroBanner from "@components/home/HeroBanner";
import FlashSaleJobs from "@components/home/FlashSaleJobs";
import CategoriesSection from "@components/home/CategoriesSection";
import LatestJobsSection from "@components/home/LatestJobsSection";
import NewsSection from "@components/home/NewsSection";
import EmployerCTASection from "@components/home/EmployerCTASection";
import EnglishTestCtaRow from "@components/home/EnglishTestCtaRow";
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
