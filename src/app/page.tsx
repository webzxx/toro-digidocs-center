// Sections
import Hero from "../components/Hero";
import About from "../components/About";
import Council from "../components/Council";
import Number from "../components/Number";

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
