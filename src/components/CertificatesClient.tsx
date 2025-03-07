'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CertificateRequest, Resident } from "@prisma/client";
import RequestCertificateButton from "./RequestCertificateButton";

type CertificatesClientProps = {
  residents: (Resident & {
      certificateRequests: CertificateRequest[];
  })[],
  userId: number
};

export default function CertificatesClient({ residents, userId }: CertificatesClientProps) {
  return (
    <Card>
      <CardHeader className="px-7 flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Certificates</CardTitle>
        </div>
        <RequestCertificateButton residents={residents} />
      </CardHeader>
      <CardContent>
        {residents.map(resident => (
          <Card key={resident.bahayToroSystemId} className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              {resident.firstName} {resident.lastName} - {resident.bahayToroSystemId}
            </h3>
            <CardContent className="p-0">
              <div className="grid gap-4">
                {resident.certificateRequests.map((certificate: CertificateRequest) => (
                  <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{certificate.certificateType.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">Ref: {certificate.referenceNumber}</p>
                      <p className="text-sm text-gray-500">Purpose: {certificate.purpose}</p>
                      <p className="text-sm text-gray-500">Requested: {new Date(certificate.requestDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      certificate.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : certificate.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {certificate.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}