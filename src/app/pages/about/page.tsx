import Image from "next/image";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center p-0">
      {/* First Section */}
      <section id="first-section" className="relative flex w-full items-center justify-center py-8">
        <div className="container grid grid-cols-1 sm:grid-cols-2">
          <div className="p-4 sm:p-24">
            <Image src="/kapjun.png" alt="bht" width={450} height={450} />
          </div>
          <div className="p-4">
            <div className="lg:pt-28">
              <h1 className="text-lg">Barangay Captain</h1>
              <p className="pt-4 text-3xl sm:text-5xl">Victor &quot;Jun&quot; V. Ferrer Jr.</p>
              <p className="pt-6 text-base sm:text-xl">
            Barangay Captain Victor &quot;Jun&quot; V. Ferrer Jr., an accomplished advocate for working people and a proud product of the District. He has tirelessly worked to improve the living conditions of his constituents, implementing various community programs and services. Under his leadership, the barangay has seen significant improvements in infrastructure, healthcare, and education. Captain Ferrer is committed to ensuring that every resident has access to the resources they need for a better quality of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section id="second-section" className="relative flex w-full items-center justify-center py-8">
        <div className="container h-auto">
          <h1 className="text-3xl sm:text-5xl">History of Barangay Bahay Toro</h1>
          <hr className="my-8 border-t border-gray-300" />
          <div>
            <p className="text-base sm:text-lg">
              <b>Bahay Toro</b>, one of the oldest barangays in Quezon City, was historically a grazing area for carabaos, or local water buffaloes, dating back to the Katipunan days. The name &quot;<b>Bahay Toro</b>&quot; means &quot;<b>Carabao House</b>&quot;, reflecting its past as a place where these farm animals were commonly found roaming.
            </p>
            <p className="pt-4 text-base sm:text-lg">
              <b>Bahay Toro</b> played a significant role in Philippine history. During the Spanish colonial period, it was known as a gathering place for the Katipuneros, the members of the revolutionary society that fought for independence from Spain. The area is also believed to be the site of the Cry of Pugad Lawin, where Andres Bonifacio and other revolutionaries tore their cedulas (residence certificates) in defiance of Spanish rule, marking the beginning of the Philippine Revolution.
            </p>
            <p className="pt-4 text-base sm:text-lg">
          Today, Bahay Toro remains a vibrant community within Quezon City, encompassing parts of Project 8, Congressional Avenue, and areas near Pagasa. It is a bustling area with local offices, schools, and residential neighborhoods, continuing its legacy as a vital part of Quezon City&apos;s historical and cultural landscape.
            </p>
            <p className="pt-4 text-base sm:text-lg">
          Bahay Toro&apos;s rich history and its transformation from a pastoral grazing area to a dynamic urban barangay highlight its importance in the broader narrative of Quezon City&apos;s development.
            </p>
            <p className="pt-4 text-base sm:text-lg">
          From its agricultural roots to its pivotal role in the fight for Philippine independence, Bahay Toro stands as a testament to the enduring spirit of the Filipino people and their journey through history.
            </p>
          </div>
        </div>
      </section>
    </main>

  );
}
