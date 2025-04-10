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
    <div id="number-section" className="relative w-full justify-center py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="w-full max-w-7xl pt-16 text-center uppercase">
      
          {/* Emergency Numbers Section */}
          <div>
            <h1 className="text-4xl">Emergency Numbers</h1>
            <h2 className="mt-2 text-xl">Dial these numbers in case of emergency</h2>
          </div>

          {/* Emergency Contacts Grid */}
          <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[
              { name: "Bahay Toro SWD", section: "Emergency Section", icon: <PiSirenFill size={30} /> },
              { name: "Bantay-bantayan", section: "Sub-station #3", icon: <MdLocalPolice size={30} /> },
              { name: "Police", section: "Department", icon: <GiPoliceOfficerHead size={30} /> },
              { name: "Bahay Toro Cesu", section: "Department", icon: <FaHeartbeat size={30} /> },
              { name: "Bahay Toro SWD", section: "Emergency Section", icon: <FaTruckMedical size={30} /> },
            ].map((item, index) => (
              <div key={index} className="flex h-72 flex-col items-center rounded-lg border border-stone-300 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-center pt-4">{item.icon}</div>
                <div className="mt-4 text-center">
                  <div className="text-base font-semibold">{item.name}</div>
                  <div className="mt-2 text-sm">{item.section}</div>
                  <div className="mt-6 text-lg font-semibold text-indigo-800">123-456-7890</div>
                  <div className="mt-2 text-lg font-semibold text-indigo-800">123-456-7890</div>
                </div>
              </div>
            ))}
          </div>

          {/* Official Emails Section */}
          <div className="pt-16">
            <h1 className="text-4xl">Official Email Addresses</h1>
            <h2 className="mt-2 text-xl">Drop a line to these email contacts for your queries.</h2>
          </div>

          {/* Email Contacts Grid */}
          <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[
              { name: "Business Permits", email: "businesspermits@gmail.com", icon: <FaAddressCard size={30} /> },
              { name: "Administrative", email: "administrative@gmail.com", icon: <MdAdminPanelSettings size={30} /> },
              { name: "Clinic", email: "clinic@gmail.com", icon: <FaClinicMedical size={30} /> },
              { name: "Clinic (Main)", email: "clinicmain@gmail.com", icon: <RiMapPinAddFill size={30} /> },
              { name: "Senior Citizen", email: "seniorcitizen@gmail.com", icon: <FaPersonWalkingWithCane size={30} /> },
            ].map((item, index) => (
              <div key={index} className="flex h-60 flex-col items-center rounded-lg border border-stone-300 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-center pt-4">{item.icon}</div>
                <div className="mt-4 text-center">
                  <div className="text-base font-semibold">{item.name}</div>
                  <div className="mt-6 text-sm font-bold lowercase text-indigo-800">{item.email}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>

  );
};

export default Number;
