import CertificateRequestWizard from "@/components/form/certificate/CertificateRequestWizard";
import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import db from "@/lib/db";
import Link from "next/link";

async function Services({ user }: WithAuthProps) {
  const userId = parseInt(user.id as unknown as string);
  const userResult = await db.user.findUnique({
    where: { id: userId },
    include: { resident: true },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      <section
        id="first-section"
        className="relative flex w-full items-center justify-center py-8"
      >
        <div className="container justify-center">
          <div className="flex items-center justify-center text-center uppercase">
            <h1 className="text-4xl font-semibold text-green-primary">
              Request Certificates
            </h1>
          </div>

          <div className="mx-auto mt-2 max-w-3xl text-center">
            <p className="text-sm text-muted-foreground">
              Already have a resident profile?{" "}
              <Link
                href="/dashboard/certificates"
                className="text-green-primary hover:underline"
              >
                Use your existing profiles
              </Link>
            </p>
          </div>

          <div className="m-4 rounded-lg border border-stone-300 bg-white p-8 shadow-lg">
            <div className="flex flex-col items-center justify-center">
              <h1 className="p-6">
                Please make sure to provide your correct Contact Number and
                Email Address
              </h1>
            </div>
            <div className="container">
              <CertificateRequestWizard hasResident = {!!userResult?.resident}/>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default withAuth(Services, {
  allowedRoles: ["USER"],
  adminOverride: false,
});
