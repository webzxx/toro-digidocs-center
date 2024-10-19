import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Gender, CivilStatus, Sector } from "@prisma/client";
import { formatDate } from '@/lib/utils';
import { ResidentWithTypes } from '@/types/types';
import Image from 'next/image';
import ResidentActions from './ResidentActions';


interface ResidentTableProps {
  residents?: ResidentWithTypes[],
  onReload: () => void
}

export default function ResidentTable({ residents, onReload }: ResidentTableProps) {
  const getGenderBadge = (gender: Gender) => {
    const variants: { [key in Gender]: "default" | "secondary" | "destructive" } = {
      MALE: "default",
      FEMALE: "secondary",
      LGBTQ: "destructive",
    };

    return (
      <Badge variant={variants[gender]}>
        {gender}
      </Badge>
    );
  };

  const getCivilStatusBadge = (status: CivilStatus) => {
    const getColor = () => {
      switch (status) {
        case 'SINGLE':
          return 'bg-blue-100 text-blue-800';
        case 'MARRIED':
          return 'bg-green-100 text-green-800';
        case 'WIDOW':
          return 'bg-gray-100 text-gray-800';
        case 'LEGALLY_SEPARATED':
          return 'bg-red-100 text-red-800';
        case 'LIVING_IN':
          return 'bg-purple-100 text-purple-800';
        case 'SEPARATED':
          return 'bg-yellow-100 text-yellow-800';
        case 'DIVORCED':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  const getSectorBadge = (sector: Sector) => {
    const getColor = () => {
      switch (sector) {
        case 'SOLO_PARENT':
          return 'bg-pink-100 text-pink-800';
        case 'PWD':
          return 'bg-blue-100 text-blue-800';
        case 'SENIOR_CITIZEN':
          return 'bg-purple-100 text-purple-800';
        case 'INDIGENT_INDIGENOUS_PEOPLE':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
        {sector.replace(/_/g, " ")}
      </span>
    );
  };

  const renderAddress = (address: any) => {
    if (!address) return "N/A";
    
    const addressString = `${address.blockLot || ''} ${address.phase || ''} ${address.street || ''}, ${address.subdivision}, ${address.barangay}, ${address.city}, ${address.province}`;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left">
            {addressString.length > 30 ? `${addressString.slice(0, 30)}...` : addressString}
          </TooltipTrigger>
          <TooltipContent className="w-80 p-0">
            <div className="bg-white rounded-md shadow-lg p-4">
              <h4 className="font-semibold text-lg mb-2">Address Details</h4>
              <dl className="space-y-1">
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Residency Type:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{address.residencyType}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Years in Bahay Toro:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{address.yearsInBahayToro || 'N/A'}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Full Address:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{addressString}</dd>
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
            <div className="bg-white rounded-md shadow-lg p-4">
              <h4 className="font-semibold text-lg mb-2">Emergency Contact</h4>
              <dl className="space-y-1">
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Name:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{contact.name}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Relationship:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{contact.relationship}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Contact:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{contact.contact}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-500">Address:</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{contact.address}</dd>
                </div>
              </dl>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const getImagePath = (id: number, image: string) => `/certificate/resident_${id}/${image}`;

  const renderProofOfIdentity = (id: number, proof: any) => {
    if (!proof) return "N/A";
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left">View Proof of Identity</TooltipTrigger>
          <TooltipContent className="w-96 p-0">
            <div className="bg-white rounded-md shadow-lg p-4">
              <h4 className="font-semibold text-lg mb-2">Proof of Identity</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">ID Photo 1</p>
                  <Image fill src={getImagePath(id, proof.idPhoto1Path)} alt="ID Photo 1" className="w-full h-auto rounded" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">ID Photo 2</p>
                  <Image fill src={getImagePath(id, proof.idPhoto2Path)} alt="ID Photo 2" className="w-full h-auto rounded" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Holding ID Photo 1</p>
                  <Image fill src={getImagePath(id, proof.holdingIdPhoto1Path)} alt="Holding ID Photo 1" className="w-full h-auto rounded" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Holding ID Photo 2</p>
                  <Image fill src={getImagePath(id, proof.holdingIdPhoto2Path)} alt="Holding ID Photo 2" className="w-full h-auto rounded" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500 mb-1">Signature</p>
                <Image fill src={getImagePath(id, proof.signaturePath)} alt="Signature" className="w-full h-auto rounded" />
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Residents</CardTitle>
        <CardDescription>List of Residents in Barangay Bahay Toro.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bahay Toro ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead>Civil Status</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Emergency Contact</TableHead>
              <TableHead>Proof of Identity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {residents && residents.length > 0 ? (
              residents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell>{resident.bahayToroSystemId}</TableCell>
                  <TableCell>{`${resident.lastName}, ${resident.firstName} ${resident.middleName || ''}`}</TableCell>
                  <TableCell>{getGenderBadge(resident.gender)}</TableCell>
                  <TableCell>{formatDate(resident.birthDate)}</TableCell>
                  <TableCell>{getCivilStatusBadge(resident.status)}</TableCell>
                  <TableCell>{resident.sector ? getSectorBadge(resident.sector) : 'N/A'}</TableCell>
                  <TableCell>{renderAddress(resident.address)}</TableCell>
                  <TableCell>{renderEmergencyContact(resident.emergencyContact)}</TableCell>
                  <TableCell>{renderProofOfIdentity(resident.id, resident.proofOfIdentity)}</TableCell>
                  <TableCell>
                    <ResidentActions resident={resident} onReload={onReload} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No residents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}