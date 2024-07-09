import { Bs1CircleFill } from "react-icons/bs";
import { Bs2CircleFill } from "react-icons/bs";
import { Bs3CircleFill } from "react-icons/bs";
import { Bs4CircleFill } from "react-icons/bs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CertificateForm from "@/components/form/CertificateForm"



export default function Services() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
        
      {/* First Section */}
      <section id="first-section" className="relative flex justify-center items-center w-full py-8">
      <div className="container h-[84rem] justify-center">
        <div className="justify-center items-center flex text-center uppercase">
          <h1 className="text-4xl text-green-primary font-semibold">Request Certificates</h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-stone-300 m-4 p-8 h-[80rem]">
          {/* <div className="text-center">
            <div className="p-10 flex flex-col items-center justify-center">
              <div className="flex container">
                <div className="flex justify-center items-center">
                <Bs1CircleFill />
                <hr className="w-[21rem] border-t-2 border-gray-300"/>
                </div>
                <div className="flex justify-center items-center">
                <Bs2CircleFill />
                <hr className="w-[21rem] border-t-2 border-gray-300"/>
                </div>
                <div className="flex justify-center items-center">
                <Bs3CircleFill />
                <hr className="w-[21rem] border-t-2 border-gray-300"/>
                </div>
                <div className="flex justify-center items-center">
                <Bs4CircleFill />
                </div>
              </div>
              <div className="flex container w-full pt-2">
                <div>
                  <h1>Personal</h1>
                </div>
                <div className="pl-72">
                  <h1>Address</h1>
                </div>
                <div className="pl-56">
                  <h1 className="w-40">Important Information</h1>
                </div>
                <div className="pl-36">
                  <h1 className="w-40">Proof of Identity</h1>
                </div>
              </div>
            </div>
          </div> */}
          <div className="flex flex-col justify-center items-center">
            <Link href="/" className={buttonVariants()}>Click for existing profile</Link>
            <h1 className="p-6">Please make sure to provide your correct Contact Number and Email Address</h1>
          </div>
          <div className="container">
            <CertificateForm />
          </div>
        </div>
      </div>
      </section>

    </main>
  )
}
