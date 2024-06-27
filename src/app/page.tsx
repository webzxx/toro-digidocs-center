import Link from "next/link";
import Image from "next/image";
import SignInForm from "@/components/form/SignInForm";
import { HelpWidget } from "@/components/HelpWidget";


// React Icons
import { FaUserCircle } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { PiSirenFill } from "react-icons/pi";
import { MdLocalPolice } from "react-icons/md";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { FaHeartbeat } from "react-icons/fa";
import { FaTruckMedical } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaClinicMedical } from "react-icons/fa";
import { RiMapPinAddFill } from "react-icons/ri";
import { FaPersonWalkingWithCane } from "react-icons/fa6";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">

      {/* First Section */}
      <section id="first-section" className="relative justify-center w-full py-8">
        <div className="container grid grid-cols-2 gap-8 h-[45rem]">
          <div className="pt-24">
            <Image src="/bht.png" alt="bht" width={900} height={900}/>
          </div>
          <div className="p-4">
          <div className="pt-28">
              <div>
                <h1 className="text-lg">About us</h1>
              </div>
              <div>
                <p className="text-5xl pt-4">If you change your city, you&apos;re changing the world.</p>
              </div>
              <div>
                <p className="text-xl pt-6">Barangay Bahay Toro is determined to address everything that hinder its way to be the best.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-300 p-4 rounded-lg">
                  <input type="checkbox" id="checkbox1" name="checkbox1" />
                  <label htmlFor="checkbox1" className="pl-3">Our Mission</label>
                </div>
                <div className="bg-gray-300 p-4 rounded-lg">
                  <input type="checkbox" id="checkbox1" name="checkbox1" />
                  <label htmlFor="checkbox1" className="pl-3">Our Vision</label>
                </div>
                <div className="bg-gray-300 p-4 rounded-lg">
                  <input type="checkbox" id="checkbox1" name="checkbox1" />
                  <label htmlFor="checkbox1" className="pl-3">Our Goal</label>
                </div>
              </div>
              <div className="pt-6">
                <p>Our vision is to empower individuals and organizations globally through innovative solutions, fostering growth, and creating positive impact in every community we serve. We aspire to be a catalyst for transformative change, inspiring excellence and sustainability in all our endeavors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section id="second-section" className="relative justify-center w-full py-8">
        <div className="container h-[62rem] justify-center">
          <div className="text-center pt-16 uppercase">
            <div>
              <h1 className="text-4xl text-green-primary font-semibold">Barangay Bahay Toro at a glance</h1>
            </div>
            <div>
              <h2 className="text-xl">Barangay Bahay Toro Officials</h2>
            </div>
          </div>
          <div className="justify-between pt-8 flex text-center">
            <div className="w-1/2 flex justify-center">
              <div className="w-1/2 flex flex-col justify-center">
                <div className="bg-white rounded-lg shadow-lg border border-stone-300 m-4 p-8 h-[44rem]">
                  <FaUserCircle className="text-4xl mb-6 mx-auto" size={80}/>
                  <h1 className="text-xl font-semibold mb-20">Members Login</h1>
                  <SignInForm />
                </div>
              </div>
              <div className="w-1/2 flex flex-col justify-center">
                <div className="bg-white rounded-lg shadow-lg border border-stone-300 m-4 p-8 h-[44rem]">
                  <h1 className="text-xl font-semibold mb-4">Certificate Forms</h1>
                  <div className="text-start">
                    <div className="p-4">
                      <Link href="/pages/services">Barangay Clearance Form</Link>
                    </div>
                    <div className="p-4">
                      <Link href="/pages/services">Barangay ID Form</Link>
                    </div>
                    <div className="p-4">
                      <Link href="/pages/services">Solo Parent Application Form</Link>
                    </div>
                    <div className="p-4">
                      <Link href="/pages/services">Cohabitation</Link>
                    </div>
                    <div className="p-4">
                      <Link href="/pages/services">Good Moral</Link>
                    </div>
                    <div className="p-4">
                      <Link href="/pages/services">Transfer of Residency</Link>
                    </div>
                    <div className="p-4">
                      <Link href="/pages/services">Residency</Link>
                    </div>
                    <div className="p-4">
                      <Link href="/pages/services">First Time Job Seeker</Link>
                    </div>
                    <div className="p-4">
                      <Link href="/pages/services">Birth Fact</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 justify-center items-center">
              <div className="text-center uppercase">
                <div>
                  <h1 className="text-4xl text-green-primary font-semibold">Barangay Council</h1>
                </div>
                <div>
                  <h2 className="text-xl">Meet our Council</h2>
                </div>
              </div>  
              <div className="bg-white rounded-lg shadow-lg border border-stone-300 m-4 p-8 h-[40rem]">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <div><FaRegUserCircle size={50} /></div>
                    <h1 className="mt-2">Jun Ferrer</h1>
                    <h2 className="text-xs font-mono">Punong Barangay</h2>
                  </div>
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <FaRegUserCircle size={50} />
                    <h1 className="mt-2">John Doe</h1>
                    <h2 className="text-xs font-mono">Brgy. Kagawad</h2>
                  </div>
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <FaRegUserCircle size={50} />
                    <h1 className="mt-2">Mark Loop</h1>
                    <h2 className="text-xs font-mono">Brgy. Kagawad</h2>
                  </div>
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <FaRegUserCircle size={50} />
                    <h1 className="mt-2">Mike Chael</h1>
                    <h2 className="text-xs font-mono">Brgy. Kagawad</h2>
                  </div>
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <FaRegUserCircle size={50} />
                    <h1 className="mt-2">Henry Kay</h1>
                    <h2 className="text-xs font-mono">Brgy. Kagawad</h2>
                  </div>
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <FaRegUserCircle size={50} />
                    <h1 className="mt-2">James Dee</h1>
                    <h2 className="text-xs font-mono">Brgy. Kagawad</h2>
                  </div>
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <FaRegUserCircle size={50} />
                    <h1 className="mt-2">Jay Pi</h1>
                    <h2 className="text-xs font-mono">Brgy. Kagawad</h2>
                  </div>
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <FaRegUserCircle size={50} />
                    <h1 className="mt-2">Marie Jude</h1>
                    <h2 className="text-xs font-mono">Brgy. Treasurer</h2>
                  </div>
                  <div className="p-8 h-[11rem] flex flex-col items-center">
                    <FaRegUserCircle size={50} />
                    <h1 className="mt-2">May Cole</h1>
                    <h2 className="text-xs font-mono">Brgy. Secretary</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Third Section */}
      <section id="third-section" className="relative justify-center w-full">
        <div className="container h-[62rem] flex justify-center">
          <div className="text-center w-full max-w-7xl pt-16 uppercase">
            <div>
              <h1 className="text-4xl">Emergency Numbers</h1>
            </div>
            <div>
              <h2 className="text-xl">Dial this numbers in case of emergency</h2>
            </div>
            <div className="flex justify-between pt-8">
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-72">
                <div className="flex items-center justify-center pt-10">
                  <PiSirenFill size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Bahay Toro SWD</div>
                  <div className="text-sm mt-2">Emergency Section</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-6">123-456-7890</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-2">123-456-7890</div>
                </div>
              </div>
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-72">
                <div className="flex items-center justify-center pt-10">
                  <MdLocalPolice size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Bantay-bantayan</div>
                  <div className="text-sm mt-2">Sub-station #3</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-6">123-456-7890</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-2">123-456-7890</div>
                </div>
              </div>
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-72">
                <div className="flex items-center justify-center pt-10">
                  <GiPoliceOfficerHead size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Police</div>
                  <div className="text-sm mt-2">Department</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-6">123-456-7890</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-2">123-456-7890</div>
                </div>
              </div>
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-72">
                <div className="flex items-center justify-center pt-10">
                  <FaHeartbeat size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Bahay Toro Cesu</div>
                  <div className="text-sm mt-2">Department</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-6">123-456-7890</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-2">123-456-7890</div>
                </div>
              </div>
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-72">
                <div className="flex items-center justify-center pt-10">
                  <FaTruckMedical size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Bahay Toro SWD</div>
                  <div className="text-sm mt-2">Emergency Section</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-6">123-456-7890</div>
                  <div className="text-lg text-indigo-800 font-semibold mt-2">123-456-7890</div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl pt-16">Official email addresses</h1>
            </div>
            <div>
              <h2 className="text-xl">Drop a line to these email contacts for your queries.</h2>
            </div>
            <div className="flex justify-between pt-8">
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-60">
                <div className="flex items-center justify-center pt-10">
                  <FaAddressCard size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Business Permits</div>
                  <div className="text-sm mt-8 text-indigo-800 font-bold lowercase">businesspermits@gmail.com</div>
                </div>
              </div>
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-60">
                <div className="flex items-center justify-center pt-10">
                  <MdAdminPanelSettings size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Administrative</div>
                  <div className="text-sm mt-8 text-indigo-800 font-bold lowercase">administrative@gmail.com</div>
                </div>
              </div>
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-60">
                <div className="flex items-center justify-center pt-10">
                  <FaClinicMedical size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Clinic</div>
                  <div className="text-sm mt-8 text-indigo-800 font-bold lowercase">clinic@gmail.com</div>
                </div>
              </div>
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-60">
                <div className="flex items-center justify-center pt-10">
                  <RiMapPinAddFill size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Clinic (Main)</div>
                  <div className="text-sm mt-8 text-indigo-800 font-bold lowercase">clinicmain@gmail.com</div>
                </div>
              </div>
              <div className="w-1/4 bg-white rounded-lg shadow-lg border border-stone-300 m-1 h-60">
                <div className="flex items-center justify-center pt-10">
                  <FaPersonWalkingWithCane size={30} />
                </div>
                <div className="p-8">
                  <div className="text-base font-semibold">Senior Citizen</div>
                  <div className="text-sm mt-8 text-indigo-800 font-bold lowercase">seniorcitizen@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Link href="/pages/chat"><HelpWidget /></Link>
      
      
    </main>
  );
}
