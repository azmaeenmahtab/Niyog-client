import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import JobDiscovery from "@/components/JobDiscovery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#f3ede2] text-[#1a1a1a]">
      <Navbar />
      <Hero />
      <JobDiscovery />
      <Footer />
    </main>
  );
}
