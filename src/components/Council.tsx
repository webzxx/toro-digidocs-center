import SignInForm from "@/components/form/SignInForm";
import Link from "next/link";
import getSession from "@/lib/getSession";

// React Icons
import { FaUserCircle } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

const Council = async () => {
  const session = await getSession();

  return (
    <div id="council-section" className="relative w-full py-8">
      <div className="container mx-auto px-4 lg:px-8 min-h-screen flex flex-col">
        {/* Section Title */}
        <div className="text-center pt-16 uppercase">
          <h1 className="text-3xl md:text-4xl text-green-primary font-semibold">
            Barangay Bahay Toro at a glance
          </h1>
          <h2 className="text-lg md:text-xl mt-2">
            Barangay Bahay Toro Officials
          </h2>
        </div>

        {/* Layout - Responsive */}
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start pt-8 space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Left Column (Login & Forms) */}
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Members Login */}
            { !session?.user ? (
              <div className="bg-white rounded-lg shadow-lg border border-stone-300 p-8 w-full lg:w-1/2">
                <FaUserCircle className="text-4xl mb-6 mx-auto" size={80} />
                <h1 className="text-xl font-semibold mb-6 text-center">
                  Members Login
                </h1>
                <SignInForm />
              </div>
            ) : (
              <div className="flex flex-col items-center bg-white rounded-lg shadow-lg border border-stone-300 p-8 w-full lg:w-1/2">
                <h1 className="text-xl font-semibold mb-6 text-center">
                  Welcome, {session.user.name} ({session.user.email})
                </h1>
                <Link href="/dashboard">
                  <button className="bg-green-primary text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300">
                    Go to {session.user.role === "ADMIN" ? "Dashboard" : "My Account"}
                  </button>
                </Link>
              </div>
            )}

            {/* Certificate Forms */}
            <div className="bg-white rounded-lg shadow-lg border border-stone-300 p-8 w-full lg:w-1/2">
              <h1 className="text-xl font-semibold mb-4">Certificate Forms</h1>
              <div className="text-start space-y-4">
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
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            {/* Barangay Council Title */}
            <div className="text-center uppercase">
              <h1 className="text-3xl md:text-4xl text-green-primary font-semibold">
                Barangay Council
              </h1>
              <h2 className="text-lg md:text-xl mt-2 mb-2">Meet our Council</h2>
            </div>

            {/* Council Members Grid */}
            <div className="bg-white rounded-lg shadow-lg border border-stone-300 p-6 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                    className="p-4 flex flex-col items-center text-center"
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
