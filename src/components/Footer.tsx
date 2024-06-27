import Link from 'next/link'
import Image from 'next/image'
import '@/styles/globals.css'

const currentYear = new Date().getFullYear()
const Footer = () => {
  return (
    <footer className="bg-beige-light  p-20">
      <div className="container text-black">
        <div className="mb-10 flex justify-between gap-16">
          <div className="flex flex-col gap-4">
            <Image src="" alt="dunno" width={156} height={63} />
            <p className="max-w-[30vw]">
              Barangay Bahay Toro
            </p>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 justify-center rounded-full bg-red pt-2 text-center text-neutrals-lightest">
              </div>
              <div className="flex h-10 w-10 justify-center rounded-full bg-red pt-2 text-center text-neutrals-lightest">
              </div>
              <div className="flex h-10 w-10 justify-center rounded-full bg-red pt-2 text-center text-neutrals-lightest">
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="min-w-[125px] p-4">
              <p className="mb-3 text-xl font-extrabold">Services</p>
              <div className="flex flex-col text-neutrals-gray">
                <Link href="/">Dashboard</Link>
                <Link href="/">Calendar</Link>
              </div>
            </div>

            <div className="min-w-[125px] p-4">
              <p className="mb-3 text-xl font-extrabold">News</p>
              <div className="flex flex-col text-neutrals-gray">
                <Link href="/">Calendar</Link>
                <Link href="/">Dashboard</Link>
              </div>
            </div>

            <div className="min-w-[125px] p-4">
              <p className="mb-3 text-xl font-extrabold">Company</p>
              <div className="flex flex-col text-neutrals-gray">
                <Link href="/">About Us</Link>
                <Link href="/">Career</Link>
                <Link href="/">Contact Us</Link>
              </div>
            </div>

            <div className="min-w-[125px] p-4">
              <p className="mb-3 text-xl font-extrabold">Information</p>
              <div className="flex flex-col text-neutrals-gray">
                <Link href="/">FAQ</Link>
                <Link href="/">Support</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t border-t-neutrals-black pt-6 text-neutrals-gray">
          <div className="flex flex-row space-x-4">Copyright © {currentYear} Barangay Bahay Toro</div>
          <ul className="flex list-inside list-disc gap-4">
            <li className="list-none">
              <Link href="/">Site Notice</Link>
            </li>
            <li>
              <Link href="/">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
export default Footer
