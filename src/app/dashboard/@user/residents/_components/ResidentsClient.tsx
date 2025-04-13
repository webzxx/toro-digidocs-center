"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatReligion } from "@/lib/utils";
import { getGenderBadge, getCivilStatusBadge, getSectorBadge } from "@/components/utils";
import { ResidentWithTypes } from "@/types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User2, Clock, User, HelpCircle, FileText } from "lucide-react";
import UserResidentActions from "./UserResidentActions";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface ResidentsClientProps {
  userResidents: ResidentWithTypes[];
}

export default function ResidentsClient({ userResidents }: ResidentsClientProps) {
  const [expandedResidentId, setExpandedResidentId] = useState<string | null>(
    userResidents.length > 0 ? userResidents[0].id.toString() : null,
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between border-b px-7 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold text-green-primary">My Resident Profiles</CardTitle>
          <CardDescription>Manage resident profiles linked to your account</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-10 gap-2 p-0 min-[590px]:w-auto min-[590px]:px-4 min-[590px]:py-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden min-[590px]:block min-[680px]:hidden">Need help?</span>
              <span className="sr-only min-[680px]:not-sr-only">How to Add Profiles</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Creating a New Resident Profile</DialogTitle>
              <DialogDescription>
                New resident profiles are created through certificate requests.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-3">A resident profile will be automatically created when you request a certificate. This ensures that:</p>
              <ul className="mb-4 ml-6 list-disc space-y-1">
                <li>Your information is properly verified</li>
                <li>All your certificates are linked to a verified resident profile</li>
                <li>You can manage profiles for family members or dependents</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Once you&apos;ve created a profile through certificate request, you&apos;ll be able to manage it here and use it for all future requests.
              </p>
            </div>
            <DialogFooter>
              <Link href="/pages/services">
                <Button>Go to Services Page</Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      {userResidents.length > 0 ? (
        <CardContent className="p-6">
          <div className="max-h-full overflow-auto">
            <Accordion type="single" collapsible value={expandedResidentId || undefined} onValueChange={setExpandedResidentId}>
              {userResidents.map((resident) => (
                <AccordionItem key={resident.id} value={resident.id.toString()} className="mb-3 overflow-hidden rounded-lg border border-muted">
                  <AccordionTrigger className="px-3 py-4 hover:no-underline sm:px-6 sm:py-4 [&>svg]:ml-2 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0 [&>svg]:text-muted-foreground">
                    <div className="flex flex-1 flex-col justify-between gap-2 text-start sm:mr-4 sm:flex-row sm:items-center sm:gap-9">
                      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                        <User className="size-4 flex-shrink-0 text-green-primary sm:size-5" />
                        <div className="flex flex-col items-start">
                          <h4 className="font-medium">{resident.firstName} {resident.lastName}</h4>
                          <p className="text-sm text-muted-foreground">ID: {resident.bahayToroSystemId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 flex-shrink-0 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground sm:text-sm">
                          Last Updated: {formatDateTime(resident.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted/20 px-6 pb-6 pt-2">
                    <div className="mb-4 mt-2 flex sm:justify-end">
                      <UserResidentActions resident={resident} />
                    </div>
                    
                    <div className="mt-2 grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-3 border-b pb-1 text-base font-semibold text-green-primary">Personal Information</h3>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                              <p className="text-base">{`${resident.firstName} ${resident.middleName || ""} ${resident.lastName}`}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Bahay Toro ID</p>
                              <p className="text-base font-medium">{resident.bahayToroSystemId}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Gender</p>
                              <div className="mt-1">{getGenderBadge(resident.gender)}</div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
                              <p className="text-base">{formatDateTime(resident.birthDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Religion</p>
                              <p className="text-base">{formatReligion(resident.religion)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Civil Status</p>
                              <div className="mt-1">{getCivilStatusBadge(resident.status)}</div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Sector</p>
                              <div className="mt-1">{resident.sector ? getSectorBadge(resident.sector) : "None"}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="mb-3 border-b pb-1 text-base font-semibold text-green-primary">Contact Information</h3>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="text-base">{resident.email || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                              <p className="text-base">{resident.contact}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-3 border-b pb-1 text-base font-semibold text-green-primary">Address Information</h3>
                          <div className="mt-2 grid gap-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Current Address</p>
                              <p className="break-words text-base">{resident.address ? 
                                `${resident.address.blockLot || ""} ${resident.address.phase || ""} ${resident.address.street || ""}, ${resident.address.subdivision}, ${resident.address.barangay}, ${resident.address.city}, ${resident.address.province}` 
                                : "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Residency Type</p>
                              <p className="text-base">{resident.address?.residencyType?.replace(/_/g, " ") || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Years in Bahay Toro</p>
                              <p className="text-base">{resident.address?.yearsInBahayToro || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-3 border-b pb-1 text-base font-semibold text-green-primary">Emergency Contact</h3>
                          <div className="mt-2 grid gap-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Name</p>
                              <p className="text-base">{resident.emergencyContact?.name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                              <p className="text-base">{resident.emergencyContact?.relationship || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Contact</p>
                              <p className="text-base">{resident.emergencyContact?.contact || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Address</p>
                              <p className="break-words text-base">{resident.emergencyContact?.address || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        {resident.proofOfIdentity && (
                          <div>
                            <h3 className="mb-3 border-b pb-1 text-base font-semibold text-green-primary">Proof of Identity</h3>
                            <div className="mt-2 grid gap-3 sm:grid-cols-2">
                              {resident.proofOfIdentity.idPhoto1Path && (
                                <div>
                                  <p className="mb-1 text-xs font-medium text-muted-foreground">ID Photo 1</p>
                                  <div className="relative aspect-video">
                                    <Image 
                                      src={resident.proofOfIdentity.idPhoto1Path} 
                                      alt="ID Photo 1"
                                      fill
                                      className="rounded-md object-cover" 
                                    />
                                  </div>
                                </div>
                              )}
                              {resident.proofOfIdentity.idPhoto2Path && (
                                <div>
                                  <p className="mb-1 text-xs font-medium text-muted-foreground">ID Photo 2</p>
                                  <div className="relative aspect-video">
                                    <Image 
                                      src={resident.proofOfIdentity.idPhoto2Path} 
                                      alt="ID Photo 2"
                                      fill
                                      className="rounded-md object-cover" 
                                    />
                                  </div>
                                </div>
                              )}
                              {resident.proofOfIdentity.holdingIdPhoto1Path && (
                                <div>
                                  <p className="mb-1 text-xs font-medium text-muted-foreground">Holding ID Photo 1</p>
                                  <div className="relative aspect-video">
                                    <Image 
                                      src={resident.proofOfIdentity.holdingIdPhoto1Path} 
                                      alt="Holding ID Photo 1"
                                      fill
                                      className="rounded-md object-cover" 
                                    />
                                  </div>
                                </div>
                              )}
                              {resident.proofOfIdentity.holdingIdPhoto2Path && (
                                <div>
                                  <p className="mb-1 text-xs font-medium text-muted-foreground">Holding ID Photo 2</p>
                                  <div className="relative aspect-video">
                                    <Image 
                                      src={resident.proofOfIdentity.holdingIdPhoto2Path} 
                                      alt="Holding ID Photo 2"
                                      fill
                                      className="rounded-md object-cover" 
                                    />
                                  </div>
                                </div>
                              )}
                              {resident.proofOfIdentity.signaturePath && (
                                <div className="sm:col-span-2">
                                  <p className="mb-1 text-xs font-medium text-muted-foreground">Signature</p>
                                  <div className="relative h-20">
                                    <Image 
                                      src={resident.proofOfIdentity.signaturePath} 
                                      alt="Signature"
                                      fill
                                      className="rounded-md object-contain" 
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
            <User2 className="mb-3 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No resident profiles found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Request a certificate to create your first resident profile
            </p>
            <Link href="/pages/services">
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Request a Certificate
              </Button>
            </Link>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between border-t p-4 text-sm text-muted-foreground">
        <div>Total profiles: {userResidents.length}</div>
      </CardFooter>
    </Card>
  );
}