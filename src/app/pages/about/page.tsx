import Image from "next/image";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center p-0">
        
      {/* First Section */}
      <section id="first-section" className="relative flex justify-center items-center w-full py-8">
      <div className="container grid grid-cols-2 h-[40rem]">
          <div className="p-24">
            <Image src="/kapjun.png" alt="bht" width={450} height={450}/>
          </div>
          <div className="p-4">
          <div className="pt-28">
              <div>
                <h1 className="text-lg">Barangay Captain</h1>
              </div>
              <div>
                <p className="text-5xl pt-4">Jun Ferrer</p>
              </div>
              <div>
                <p className="text-xl pt-6">Barangay Captain Jun Ferrer, an accomplished advocate for working people and a proud product of the District. He has tirelessly worked to improve the living conditions of his constituents, implementing various community programs and services. Under his leadership, the barangay has seen significant improvements in infrastructure, healthcare, and education. Captain Ferrer is committed to ensuring that every resident has access to the resources they need for a better quality of life.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="second-section" className="relative flex justify-center items-center w-full">
        <div className="container h-[36rem]">
          <div>
            <h1 className="text-5xl">History of Barangay Bahay Toro</h1>
          </div>
          <hr className="border-t border-gray-300 my-8"/>
          <div>
          <h1 className="text-lg"><b>Bahay Toro</b>, one of the oldest barangays in Quezon City, was historically a grazing area for carabaos, or local water buffaloes, dating back to the Katipunan days. The name &quot;<b>Bahay Toro</b>&quot; means &quot;<b>Carabao House</b>,&quot; reflecting its past as a place where these farm animals were commonly found roaming.</h1>
          <h1 className="text-lg pt-4"><b>Bahay Toro</b> played a significant role in Philippine history. During the Spanish colonial period, it was known as a gathering place for the Katipuneros, the members of the revolutionary society that fought for independence from Spain. The area is also believed to be the site of the Cry of Pugad Lawin, where Andres Bonifacio and other revolutionaries tore their cedulas (residence certificates) in defiance of Spanish rule, marking the beginning of the Philippine Revolution.</h1>
          <h1 className="text-lg pt-4">Today, Bahay Toro remains a vibrant community within Quezon City, encompassing parts of Project 8, Congressional Avenue, and areas near Pagasa. It is a bustling area with local offices, schools, and residential neighborhoods, continuing its legacy as a vital part of Quezon City&apos;s historical and cultural landscape.</h1>
          <h1 className="text-lg pt-4">Bahay Toro&apos;s rich history and its transformation from a pastoral grazing area to a dynamic urban barangay highlight its importance in the broader narrative of Quezon City&apos;s development.</h1>
          <h1 className="text-lg pt-4">From its agricultural roots to its pivotal role in the fight for Philippine independence, Bahay Toro stands as a testament to the enduring spirit of the Filipino people and their journey through history.</h1>
          </div>
        </div>
      </section>
    </main>
  )
}
