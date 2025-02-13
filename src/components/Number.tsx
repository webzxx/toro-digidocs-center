// React Icons
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

const Number = () => {
  return (
    <div id="number-section" className="relative justify-center w-full py-8">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center w-full max-w-7xl pt-16 uppercase">
      
      {/* Emergency Numbers Section */}
      <div>
        <h1 className="text-4xl">Emergency Numbers</h1>
        <h2 className="text-xl mt-2">Dial these numbers in case of emergency</h2>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-8">
        {[
          { name: "Bahay Toro SWD", section: "Emergency Section", icon: <PiSirenFill size={30} /> },
          { name: "Bantay-bantayan", section: "Sub-station #3", icon: <MdLocalPolice size={30} /> },
          { name: "Police", section: "Department", icon: <GiPoliceOfficerHead size={30} /> },
          { name: "Bahay Toro Cesu", section: "Department", icon: <FaHeartbeat size={30} /> },
          { name: "Bahay Toro SWD", section: "Emergency Section", icon: <FaTruckMedical size={30} /> },
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg border border-stone-300 p-6 flex flex-col items-center h-72">
            <div className="flex items-center justify-center pt-4">{item.icon}</div>
            <div className="text-center mt-4">
              <div className="text-base font-semibold">{item.name}</div>
              <div className="text-sm mt-2">{item.section}</div>
              <div className="text-lg text-indigo-800 font-semibold mt-6">123-456-7890</div>
              <div className="text-lg text-indigo-800 font-semibold mt-2">123-456-7890</div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Emails Section */}
      <div className="pt-16">
        <h1 className="text-4xl">Official Email Addresses</h1>
        <h2 className="text-xl mt-2">Drop a line to these email contacts for your queries.</h2>
      </div>

      {/* Email Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-8">
        {[
          { name: "Business Permits", email: "businesspermits@gmail.com", icon: <FaAddressCard size={30} /> },
          { name: "Administrative", email: "administrative@gmail.com", icon: <MdAdminPanelSettings size={30} /> },
          { name: "Clinic", email: "clinic@gmail.com", icon: <FaClinicMedical size={30} /> },
          { name: "Clinic (Main)", email: "clinicmain@gmail.com", icon: <RiMapPinAddFill size={30} /> },
          { name: "Senior Citizen", email: "seniorcitizen@gmail.com", icon: <FaPersonWalkingWithCane size={30} /> },
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg border border-stone-300 p-6 flex flex-col items-center h-60">
            <div className="flex items-center justify-center pt-4">{item.icon}</div>
            <div className="text-center mt-4">
              <div className="text-base font-semibold">{item.name}</div>
              <div className="text-sm mt-6 text-indigo-800 font-bold lowercase">{item.email}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
</div>

  )
}

export default Number;
