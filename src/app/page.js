import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import JobDiscovery from "@/components/JobDiscovery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#050505] text-white">
      <Navbar />
      <Hero />
      <JobDiscovery />
      <Footer />
    </main>
  );
}
