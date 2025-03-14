'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DialogClose } from "@radix-ui/react-dialog";
import { createCertificate } from "@/app/dashboard/@user/certificates/actions";
import { CertificateType, Resident } from "@prisma/client";
import { DatePicker } from "./DatePicker";
import { getCertificateTypeLabel } from "@/lib/certificate-utils";
import { useRouter } from "next/navigation";
import { CertificateInput, certificateSchema } from "@/types/types";

type RequestCertificateButtonProps = {
  residents: Resident[]
};

export default function RequestCertificateButton({ residents }: RequestCertificateButtonProps) {
  const router = useRouter();
  const form = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      purpose: "",
    }
  });

  const certificateType = form.watch('certificateType');

  const [selectedResident, setSelectedResident] = useState("");

  // Handle click on the Request Certificate button based on residents availability
  const handleRequestClick = (e: React.MouseEvent) => {
    if (residents.length === 0) {
      e.preventDefault();
      router.push('/pages/services');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleRequestClick}>Request Certificate</Button>
      </DialogTrigger>
      {residents.length > 0 ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Certificate</DialogTitle>
            <DialogDescription>
              Fill out the form below to request a new certificate.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resident" className="text-right">Resident</Label>
                  <Select onValueChange={setSelectedResident}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select resident" />
                    </SelectTrigger>
                    <SelectContent>
                      {residents.map((resident: Resident) => (
                        <SelectItem key={resident.id} value={resident.id.toString()}>
                          {resident.firstName} {resident.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormField
                  control={form.control}
                  name="certificateType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Type <span className="text-red-600 font-bold">*</span></FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select certificate type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CertificateType).map(([key]) => (
                            <SelectItem key={key} value={key}>
                              {getCertificateTypeLabel(key as CertificateType)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose <span className="text-red-600 font-bold">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {certificateType === 'SOLO_PARENT' && (
                  <>
                    <FormField
                      control={form.control}
                      name="childName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Name <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="soloParentSince"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Solo Parent Since <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="presentedBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Presented by <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registryNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registry No <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {certificateType === 'COHABITATION' && (
                  <>
                    <FormField
                      control={form.control}
                      name="birthAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Address <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="spouseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spouse Name <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="spouseBirthAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spouse Birth Address <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfMarriage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Marriage <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <DatePicker
                              allowFutureDates
                              value={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {certificateType === 'NO_INCOME' && (
                  <FormField
                    control={form.control}
                    name="noIncomeSince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No Income Since <span className="text-red-600 font-bold">*</span></FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {certificateType === 'FIRST_TIME_JOB_SEEKER' && (
                  <FormField
                    control={form.control}
                    name="dateOfResidency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Residency <span className="text-red-600 font-bold">*</span></FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {certificateType === 'RESIDENCY' && (
                  <>
                    <FormField
                      control={form.control}
                      name="birthAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Address <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfResidency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Residency <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {certificateType === 'TRANSFER_OF_RESIDENCY' && (
                  <FormField
                    control={form.control}
                    name="newAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Address <span className="text-red-600 font-bold">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {certificateType === 'LIVING_STILL' && (
                  <FormField
                    control={form.control}
                    name="dateOfTabloid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Tabloid <span className="text-red-600 font-bold">*</span></FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {certificateType === 'BIRTH_FACT' && (
                  <>
                    <FormField
                      control={form.control}
                      name="dateBorn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Born <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="childName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Name <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Address <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="witnessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Witness Name <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="witnessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Witness Type <span className="text-red-600 font-bold">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {['SOLO_PARENT', 'COHABITATION', 'GOOD_MORAL', 'NO_INCOME', 'RESIDENCY', 'TRANSFER_OF_RESIDENCY', 'LIVING_STILL', 'BIRTH_FACT'].includes(certificateType) && (
                  <FormField
                    control={form.control}
                    name="requestOf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Request of <span className="text-red-600 font-bold">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" onClick={() => {
                    const result = form.getValues();
                    if (selectedResident) {
                      createCertificate(result, parseInt(selectedResident));
                    }
                  }}>
                    Submit Request
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}