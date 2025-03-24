"use client";


export default function Chat() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
          
      {/* First Section */}
      <section id="first-section" className="relative flex justify-center items-center w-full py-8">
        <div className="w-full max-w-4xl text-center relative">
          <h2 className="text-7xl mb-8">CHAT</h2>
          <div className="bg-white rounded-lg shadow-lg border border-stone-300 p-8 h-[44rem] overflow-y-auto">
            {/* Placeholder div to prevent content from being covered by the form */}
            <div className="h-20"></div>
          </div>
          <form className="absolute bottom-0 w-full max-w-4xl p-4 bg-white border-t border-gray-300">

          </form>
        </div>
      </section>
  
    </main>
  );
}
  