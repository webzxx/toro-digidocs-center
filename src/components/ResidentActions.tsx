"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from 'lucide-react';
import { deleteResident, updateResident } from '@/app/dashboard/@admin/residents/actions';
import { ResidentWithTypes } from '@/types/types';
import { DatePicker } from './DatePicker';

interface ResidentActionsProps {
  resident: ResidentWithTypes;
}

export default function ResidentActions({ resident }: ResidentActionsProps) {
  const [editedResident, setEditedResident] = useState(resident);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedResident(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setEditedResident(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedResident(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      } as Required<typeof prev.address>
    }));
  };

  const handleDateChange = (name: string, value: Date) => {
    setEditedResident(prev => ({
      ...prev,
      [name]: value ? value.toISOString().split('T')[0] : ''
    }));
  }

  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedResident(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      } as Required<typeof prev.emergencyContact>
    }));
  };

  const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteConfirmation(e.target.value);
  };

  const handleEditResident = () => {
    if (JSON.stringify(resident) === JSON.stringify(editedResident)) return;
    updateResident(resident.id, editedResident);
  };

  const handleDeleteResident = () => {
    deleteResident(resident.id);
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <h2>{resident.bahayToroSystemId}</h2>
            <DialogDescription>Update resident information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 pr-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={editedResident.firstName}
                className="col-span-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="middleName" className="text-right">
                Middle Name
              </Label>
              <Input
                id="middleName"
                name="middleName"
                value={editedResident.middleName || ''}
                className="col-span-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={editedResident.lastName}
                className="col-span-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <Select
                onValueChange={handleSelectChange('gender')}
                defaultValue={editedResident.gender}
              >
                <SelectTrigger className="w-[280px]" id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">MALE</SelectItem>
                  <SelectItem value="FEMALE">FEMALE</SelectItem>
                  <SelectItem value="LGBTQ">LGBTQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthDate" className="text-right">
                Birth Date
              </Label>
              <DatePicker
                value={editedResident.birthDate ? new Date(editedResident.birthDate) : null}
                onChange={(date) => handleDateChange('birthDate', date!)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={editedResident.email || ''}
                className="col-span-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact
              </Label>
              <Input
                id="contact"
                name="contact"
                value={editedResident.contact}
                className="col-span-3"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="religion" className="text-right">
                Religion
              </Label>
              <Select
                onValueChange={handleSelectChange('religion')}
                defaultValue={editedResident.religion ?? ''}
              >
                <SelectTrigger className="w-[280px]" id="religion">
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CATHOLIC">Catholic</SelectItem>
                  <SelectItem value="IGLESIA_NI_CRISTO">Iglesia ni Cristo</SelectItem>
                  <SelectItem value="AGLIPAY">Aglipay</SelectItem>
                  <SelectItem value="BAPTIST">Baptist</SelectItem>
                  <SelectItem value="DATING_DAAN">Dating Daan</SelectItem>
                  <SelectItem value="ISLAM">Islam</SelectItem>
                  <SelectItem value="JEHOVAHS_WITNESSES">Jehovah&apos;s Witnesses</SelectItem>
                  <SelectItem value="OTHERS">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Civil Status
              </Label>
              <Select
                onValueChange={handleSelectChange('status')}
                defaultValue={editedResident.status}
              >
                <SelectTrigger className="w-[280px]" id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="WIDOW">Widow</SelectItem>
                  <SelectItem value="LEGALLY_SEPARATED">Legally Separated</SelectItem>
                  <SelectItem value="LIVING_IN">LIVING-IN</SelectItem>
                  <SelectItem value="SEPARATED">SEPARATED</SelectItem>
                  <SelectItem value="DIVORCED">DIVORCED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sector" className="text-right">
                Sector
              </Label>
              <Select
                onValueChange={handleSelectChange('sector')}
                defaultValue={editedResident.sector ?? ''}
              >
                <SelectTrigger className="w-[280px]" id="sector">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLO_PARENT">Solo Parent</SelectItem>
                  <SelectItem value="PWD">PWD</SelectItem>
                  <SelectItem value="SENIOR_CITIZEN">Senior Citizen</SelectItem>
                  <SelectItem value="INDIGENT_INDIGENOUS_PEOPLE">Indigent Indigenous People</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h3 className="font-semibold mt-4">Address</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="residencyType" className="text-right">
                Residency Type
              </Label>
              <Select
                onValueChange={handleSelectChange('address.residencyType')}
                defaultValue={editedResident.address?.residencyType}
              >
                <SelectTrigger className="w-[280px]" id="residencyType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME_OWNER">Home owner</SelectItem>
                  <SelectItem value="TENANT">Tenant</SelectItem>
                  <SelectItem value="HELPER">Helper</SelectItem>
                  <SelectItem value="CONSTRUCTION_WORKER">Construction Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="yearsInBahayToro" className="text-right">
                Years in Bahay Toro
              </Label>
              <Input
                id="yearsInBahayToro"
                name="yearsInBahayToro"
                type="number"
                value={editedResident.address?.yearsInBahayToro || ''}
                className="col-span-3"
                onChange={handleAddressChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="blockLot" className="text-right">
                Block/Lot
              </Label>
              <Input
                id="blockLot"
                name="blockLot"
                value={editedResident.address?.blockLot || ''}
                className="col-span-3"
                onChange={handleAddressChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phase" className="text-right">
                Phase
              </Label>
              <Input
                id="phase"
                name="phase"
                value={editedResident.address?.phase || ''}
                className="col-span-3"
                onChange={handleAddressChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">
                Street
              </Label>
              <Input
                id="street"
                name="street"
                value={editedResident.address?.street || ''}
                className="col-span-3"
                onChange={handleAddressChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subdivision" className="text-right">
                Subdivision
              </Label>
              <Input
                id="subdivision"
                name="subdivision"
                value={editedResident.address?.subdivision || ''}
                className="col-span-3"
                onChange={handleAddressChange}
              />
            </div>
            <h3 className="font-semibold mt-4">Emergency Contact</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyName" className="text-right">
                Name
              </Label>
              <Input
                id="emergencyName"
                name="name"
                value={editedResident.emergencyContact?.name || ''}
                className="col-span-3"
                onChange={handleEmergencyContactChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyRelationship" className="text-right">
                Relationship
              </Label>
              <Input
                id="emergencyRelationship"
                name="relationship"
                value={editedResident.emergencyContact?.relationship || ''}
                className="col-span-3"
                onChange={handleEmergencyContactChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyContact" className="text-right">
                Contact
              </Label>
              <Input
                id="emergencyContact"
                name="contact"
                value={editedResident.emergencyContact?.contact || ''}
                className="col-span-3"
                onChange={handleEmergencyContactChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyAddress" className="text-right">
                Address
              </Label>
              <Input
                id="emergencyAddress"
                name="address"
                value={editedResident.emergencyContact?.address || ''}
                className="col-span-3"
                onChange={handleEmergencyContactChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={handleEditResident}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h2>{resident.bahayToroSystemId}</h2>
            <DialogDescription>
              This will <span className="text-red-600 font-bold">delete all records</span> related to the resident, <b>{resident.firstName} {resident.lastName}</b>!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmDelete" className="text-right">
                Confirm Bahay Toro ID
              </Label>
              <Input
                id="confirmDelete"
                value={deleteConfirmation}
                placeholder="Type Bahay Toro ID to confirm"
                className="col-span-3"
                onChange={handleDeleteChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="destructive"
                type="submit"
                disabled={deleteConfirmation !== resident.bahayToroSystemId}
                onClick={handleDeleteResident}
              >
                Delete Resident
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}