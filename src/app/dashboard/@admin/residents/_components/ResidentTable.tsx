import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateTime, formatReligion } from "@/lib/utils";
import { ResidentWithTypes } from "@/types/types";
import Image from "next/image";
import ResidentActions from "./ResidentActions";
import { getGenderBadge, getCivilStatusBadge, getSectorBadge } from "@/components/utils";

interface ResidentTableProps {
  residents?: ResidentWithTypes[];
  isLoading?: boolean;
  refetch: () => void;
}

export default function ResidentTable({ residents, isLoading = false, refetch }: ResidentTableProps) {
  const renderAddress = (address: any) => {
    if (!address) return "N/A";
    
    const addressString = `${address.blockLot || ""} ${address.phase || ""} ${address.street || ""}, ${address.subdivision}, ${address.barangay}, ${address.city}, ${address.province}`;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left">
            {addressString.length > 30 ? `${addressString.slice(0, 30)}...` : addressString}
          </TooltipTrigger>
          <TooltipContent className="w-80 p-0">
            <div className="rounded-md bg-white p-4 shadow-lg">
              <h4 className="mb-2 text-lg font-semibold">Address Details</h4>
              <dl className="space-y-1">
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Residency Type:</dt>
                  <dd className="col-span-2 text-sm text-gray-900">{address.residencyType}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Years in Bahay Toro:</dt>
                  <dd className="col-span-2 text-sm text-gray-900">{address.yearsInBahayToro || "N/A"}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Full Address:</dt>
                  <dd className="col-span-2 text-sm text-gray-900">{addressString}</dd>
                </div>
              </dl>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  const renderEmergencyContact = (contact: any) => {
    if (!contact) return "N/A";
    
    const contactPreview = `${contact.name} (${contact.relationship})`;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left">
            {contactPreview}
          </TooltipTrigger>
          <TooltipContent className="w-80 p-0">
            <div className="rounded-md bg-white p-4 shadow-lg">
              <h4 className="mb-2 text-lg font-semibold">Emergency Contact</h4>
              <dl className="space-y-1">
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Name:</dt>
                  <dd className="col-span-2 text-sm text-gray-900">{contact.name}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Relationship:</dt>
                  <dd className="col-span-2 text-sm text-gray-900">{contact.relationship}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Contact:</dt>
                  <dd className="col-span-2 text-sm text-gray-900">{contact.contact}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Address:</dt>
                  <dd className="col-span-2 text-sm text-gray-900">{contact.address}</dd>
                </div>
              </dl>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  const renderProofOfIdentity = (id: number, proof: any) => {
    if (!proof) return "N/A";
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left">View Proof of Identity</TooltipTrigger>
          <TooltipContent className="w-96 p-0">
            <div className="rounded-md bg-white p-4 shadow-lg">
              <h4 className="mb-2 text-lg font-semibold">Proof of Identity</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">ID Photo 1</p>
                  <Image layout='responsive' width={200} height={150} src={proof.idPhoto1Path} alt="ID Photo 1" className="rounded" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">ID Photo 2</p>
                  <Image layout='responsive' width={200} height={150} src={proof.idPhoto2Path} alt="ID Photo 2" className="rounded" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">Holding ID Photo 1</p>
                  <Image layout='responsive' width={200} height={150} src={proof.holdingIdPhoto1Path} alt="Holding ID Photo 1" className="rounded" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">Holding ID Photo 2</p>
                  <Image layout='responsive' width={200} height={150} src={proof.holdingIdPhoto2Path} alt="Holding ID Photo 2" className="rounded" />
                </div>
              </div>
              <div className="mt-2">
                <p className="mb-1 text-sm font-medium text-gray-500">Signature</p>
                <Image layout='responsive' width={200} height={150} src={proof.signaturePath} alt="Signature" className="rounded" />
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Bahay Toro ID</TableHead>
            <TableHead className="w-52">Name</TableHead>
            <TableHead className="w-24">Gender</TableHead>
            <TableHead className="w-32">Birth Date</TableHead>
            <TableHead className="w-32">Religion</TableHead>
            <TableHead className="w-36">Civil Status</TableHead>
            <TableHead className="w-40">Sector</TableHead>
            <TableHead className="w-48">Address</TableHead>
            <TableHead className="w-48">Emergency Contact</TableHead>
            <TableHead className="w-36">Proof of Identity</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents && residents.length > 0 ? (
            residents.map((resident) => (
              <TableRow 
                key={resident.id}
                className={isLoading ? "animate-pulse bg-gradient-to-r from-transparent via-gray-200/60 to-transparent bg-[length:400%_100%] bg-[0%_0] transition-all" : ""}
              >
                <TableCell className="font-medium">{resident.bahayToroSystemId}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-left">
                        {`${resident.lastName}, ${resident.firstName} ${resident.middleName || ""}`}
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="p-2">
                          <p><strong>First Name:</strong> {resident.firstName}</p>
                          <p><strong>Middle Name:</strong> {resident.middleName || "N/A"}</p>
                          <p><strong>Last Name:</strong> {resident.lastName}</p>
                          <p><strong>Email:</strong> {resident.email || "N/A"}</p>
                          <p><strong>Contact:</strong> {resident.contact}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{getGenderBadge(resident.gender)}</TableCell>
                <TableCell>{formatDateTime(resident.birthDate)}</TableCell>
                <TableCell>{formatReligion(resident.religion)}</TableCell>
                <TableCell>{getCivilStatusBadge(resident.status)}</TableCell>
                <TableCell>{resident.sector ? getSectorBadge(resident.sector) : "N/A"}</TableCell>
                <TableCell>{renderAddress(resident.address)}</TableCell>
                <TableCell>{renderEmergencyContact(resident.emergencyContact)}</TableCell>
                <TableCell>{renderProofOfIdentity(resident.id, resident.proofOfIdentity)}</TableCell>
                <TableCell>
                  <ResidentActions resident={resident} refetch={refetch}/>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} className="py-8 text-center">
                No residents found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}