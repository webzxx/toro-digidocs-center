"use client";


export default function Chat() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
          
      {/* First Section */}
      <section id="first-section" className="relative flex w-full items-center justify-center py-8">
        <div className="relative w-full max-w-4xl text-center">
          <h2 className="mb-8 text-7xl">CHAT</h2>
          <div className="h-[44rem] overflow-y-auto rounded-lg border border-stone-300 bg-white p-8 shadow-lg">
            {/* Placeholder div to prevent content from being covered by the form */}
            <div className="h-20"></div>
          </div>
          <form className="absolute bottom-0 w-full max-w-4xl border-t border-gray-300 bg-white p-4">

          </form>
        </div>
      </section>
  
    </main>
  );
}
  