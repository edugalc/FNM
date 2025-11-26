import HeroSection from "@/components/HeroSection";
import LastCourses from "@/components/LastCourses";
import FeaturesSection from "@/components/FeaturesSection";
import FeaturedEbooks from "@/components/FeaturedEbooks";
import AboutPreview from "@/components/AboutPreview";
import CallToAction from "@/components/CallToAction";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />
      <LastCourses />
      <FeaturesSection />
      <FeaturedEbooks />
      <AboutPreview />
      <CallToAction />
    </main>
  );
}
