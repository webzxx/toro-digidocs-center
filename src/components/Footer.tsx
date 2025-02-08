import Link from "next/link";
import Image from "next/image";
import "@/styles/globals.css";

const currentYear = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className="bg-beige-light p-6 sm:p-8 lg:p-12">
      <div className="container mx-auto text-black">
        <div className="mb-10 flex flex-col lg:flex-row justify-between gap-6 lg:gap-16">
          {/* Left Section */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <p className="max-w-full sm:max-w-[40vw] text-center lg:text-left text-xl font-extrabold">
              Barangay Bahay Toro
            </p>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 justify-center rounded-full bg-red text-neutrals-lightest" />
              <div className="flex h-10 w-10 justify-center rounded-full bg-red text-neutrals-lightest" />
              <div className="flex h-10 w-10 justify-center rounded-full bg-red text-neutrals-lightest" />
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-6 lg:gap-12">
            <div className="min-w-[125px] text-center lg:text-left">
              <p className="mb-3 text-xl font-bold">More Pages</p>
              <div className="flex flex-col text-neutrals-gray space-y-1">
                <Link href="/">Home</Link>
                <Link href="/">About Us</Link>
                <Link href="/">Services</Link>
              </div>
            </div>

            <div className="min-w-[125px] text-center lg:text-left">
              <p className="mb-3 text-xl font-bold">Govt. Info</p>
              <div className="flex flex-col text-neutrals-gray space-y-1">
                <Link href="/">Privacy Policy</Link>
                <Link href="/">Terms & Conditions</Link>
                <Link href="/">Disclaimer</Link>
                <Link href="/">FAQ</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutrals-black pt-6 text-center lg:text-left text-neutrals-gray">
          <p>Copyright © {currentYear} Barangay Bahay Toro</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
