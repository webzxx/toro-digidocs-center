import SignInForm from "@/components/form/SignInForm";
import Link from "next/link";
import getSession from "@/lib/auth/getSession";

// React Icons
import { FaUserCircle } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

const Council = async () => {
  const session = await getSession();

  return (
    <div id="council-section" className="relative w-full py-8">
      <div className="container mx-auto flex min-h-screen flex-col px-4 lg:px-8">
        {/* Section Title */}
        <div className="pt-16 text-center uppercase">
          <h1 className="text-3xl font-semibold text-green-primary md:text-4xl">
            Barangay Bahay Toro at a glance
          </h1>
          <h2 className="mt-2 text-lg md:text-xl">
            Barangay Bahay Toro Officials
          </h2>
        </div>

        {/* Layout - Responsive */}
        <div className="flex flex-col items-center justify-center space-y-6 pt-8 lg:flex-row lg:items-start lg:space-x-6 lg:space-y-0">
          {/* Left Column (Login & Forms) */}
          <div className="flex w-full flex-col space-y-6 lg:w-1/2 lg:flex-row lg:space-x-6 lg:space-y-0">
            {/* Members Login */}
            { !session?.user ? (
              <div className="w-full rounded-lg border border-stone-300 bg-white p-8 shadow-lg lg:w-1/2">
                <FaUserCircle className="mx-auto mb-6 text-4xl" size={80} />
                <h1 className="mb-6 text-center text-xl font-semibold">
                  Members Login
                </h1>
                <SignInForm />
              </div>
            ) : (
              <div className="flex w-full flex-col items-center rounded-lg border border-stone-300 bg-white p-8 shadow-lg lg:w-1/2">
                <h1 className="mb-6 text-center text-xl font-semibold">
                  Welcome, {session.user.name} ({session.user.email})
                </h1>
                <Link href="/dashboard">
                  <button className="rounded-md bg-green-primary px-4 py-2 text-white hover:bg-green-600 focus:border-blue-300 focus:outline-none focus:ring">
                    Go to {session.user.role === "ADMIN" ? "Dashboard" : "My Account"}
                  </button>
                </Link>
              </div>
            )}

            {/* Certificate Forms */}
            <div className="w-full rounded-lg border border-stone-300 bg-white p-8 shadow-lg lg:w-1/2">
              <h1 className="mb-4 text-xl font-semibold">Certificate Forms</h1>
              <div className="space-y-4 text-start">
                {[
                  "Barangay Clearance Form",
                  "Barangay ID Form",
                  "Solo Parent Application Form",
                  "Cohabitation",
                  "Good Moral",
                  "Transfer of Residency",
                  "Residency",
                  "First Time Job Seeker",
                  "Birth Fact",
                ].map((form, index) => (
                  <div key={index} className="p-2 hover:text-green-500">
                    <Link href="/pages/services">{form}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Council Members) */}
          <div className="flex w-full flex-col items-center lg:w-1/2">
            {/* Barangay Council Title */}
            <div className="text-center uppercase">
              <h1 className="text-3xl font-semibold text-green-primary md:text-4xl">
                Barangay Council
              </h1>
              <h2 className="mb-2 mt-2 text-lg md:text-xl">Meet our Council</h2>
            </div>

            {/* Council Members Grid */}
            <div className="w-full rounded-lg border border-stone-300 bg-white p-6 shadow-lg">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { name: "Jun Ferrer", role: "Punong Barangay" },
                  { name: "John Doe", role: "Brgy. Kagawad" },
                  { name: "Mark Loop", role: "Brgy. Kagawad" },
                  { name: "Mike Chael", role: "Brgy. Kagawad" },
                  { name: "Henry Kay", role: "Brgy. Kagawad" },
                  { name: "James Dee", role: "Brgy. Kagawad" },
                  { name: "Jay Pi", role: "Brgy. Kagawad" },
                  { name: "Marie Jude", role: "Brgy. Treasurer" },
                  { name: "May Cole", role: "Brgy. Secretary" },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 text-center"
                  >
                    <FaRegUserCircle size={50} className="mb-2" />
                    <h1 className="text-lg font-medium">{member.name}</h1>
                    <h2 className="text-sm text-gray-600">{member.role}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Council;
