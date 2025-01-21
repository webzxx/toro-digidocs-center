// Sections
import Hero from "../components/Hero"
import Council from "../components/Council"
import Contact from "../components/Contact"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      {/* Hero Section */}
      <Hero />

      {/* Councils Section */}
      <Council />

      {/* Contact Section */}
      <Contact />
    </main>
  );
}
