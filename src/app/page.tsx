// Sections
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Council from "@/components/home/Council";
import Number from "@/components/home/Number";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Council Section */}
      <Council />

      {/* Number Section */}
      <Number />
    </main>
  );
}
