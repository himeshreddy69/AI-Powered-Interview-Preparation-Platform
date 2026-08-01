import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";
import SearchSection from "../components/common/SearchSection";
import CompanySection from "../components/common/CompanySection";
import Features from "../components/common/Features";
import InterviewCategories from "../components/common/InterviewCategories";
import DashboardPreview from "../components/common/DashboardPreview";
import HowItWorks from "../components/common/HowItWorks";
import Testimonials from "../components/common/Testimonials";
import CTASection from "../components/common/CTASection";
import Footer from "../components/common/Footer";
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchSection />
      <CompanySection />
      <Features />
      <InterviewCategories />
      <DashboardPreview />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
}

export default Home;