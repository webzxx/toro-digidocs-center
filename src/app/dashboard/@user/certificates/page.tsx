import { withAuth, WithAuthProps } from "@/lib/withAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleCertificates = [
  {
    id: 1,
    type: "Barangay Clearance",
    requestDate: "2024-01-15",
    purpose: "Employment",
    status: "Ready for Pickup",
    referenceNumber: "BC-2024-001"
  },
  {
    id: 2,
    type: "Certificate of Residency",
    requestDate: "2024-01-18",
    purpose: "School Requirement",
    status: "Processing",
    referenceNumber: "CR-2024-002"
  },
];

function CertificatesPage({ user }: WithAuthProps) {
  return (
    <div className='flex flex-col gap-4 lg:p-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sampleCertificates.map((certificate) => (
              <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{certificate.type}</p>
                  <p className="text-sm text-gray-500">Ref: {certificate.referenceNumber}</p>
                  <p className="text-sm text-gray-500">Purpose: {certificate.purpose}</p>
                  <p className="text-sm text-gray-500">Requested: {certificate.requestDate}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  certificate.status === 'Ready for Pickup' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {certificate.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CertificatesPage, { allowedRoles: ["USER"], adminOverride: false });