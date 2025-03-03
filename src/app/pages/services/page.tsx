import CertificateForm from "@/components/form/certificate/CertificateForm"
import { withAuth, WithAuthProps } from "@/lib/withAuth";

function Services({ user }: WithAuthProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      <section id="first-section" className="relative flex justify-center items-center w-full py-8">
        <div className="container justify-center">
          <div className="justify-center items-center flex text-center uppercase">
            <h1 className="text-4xl text-green-primary font-semibold">Request Certificates</h1>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-stone-300 m-4 p-8">
            <div className="flex flex-col justify-center items-center">
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

export default withAuth(Services, { allowedRoles: ["USER"], adminOverride: false });
