import Link from "next/link";
import Image from "next/image";
import "@/styles/globals.css";

const currentYear = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className="bg-beige-light p-6 sm:p-8 lg:p-12">
      <div className="container mx-auto text-black">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:gap-16">
          {/* Left Section */}
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <p className="max-w-full text-center text-xl font-extrabold sm:max-w-[40vw] lg:text-left">
              Barangay Bahay Toro
            </p>
            <div className="flex gap-4">
              <div className="bg-red text-neutrals-lightest flex h-10 w-10 justify-center rounded-full" />
              <div className="bg-red text-neutrals-lightest flex h-10 w-10 justify-center rounded-full" />
              <div className="bg-red text-neutrals-lightest flex h-10 w-10 justify-center rounded-full" />
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="flex flex-wrap justify-center gap-6 lg:justify-end lg:gap-12">
            <div className="min-w-[125px] text-center lg:text-left">
              <p className="mb-3 text-xl font-bold">More Pages</p>
              <div className="text-neutrals-gray flex flex-col space-y-1">
                <Link href="/">Home</Link>
                <Link href="/">About Us</Link>
                <Link href="/">Services</Link>
              </div>
            </div>

            <div className="min-w-[125px] text-center lg:text-left">
              <p className="mb-3 text-xl font-bold">Govt. Info</p>
              <div className="text-neutrals-gray flex flex-col space-y-1">
                <Link href="/">Privacy Policy</Link>
                <Link href="/">Terms & Conditions</Link>
                <Link href="/">Disclaimer</Link>
                <Link href="/">FAQ</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-neutrals-black text-neutrals-gray border-t pt-6 text-center lg:text-left">
          <p>Copyright © {currentYear} Barangay Bahay Toro</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
