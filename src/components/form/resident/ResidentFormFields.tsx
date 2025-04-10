import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import { ResidentWithTypes } from "@/types/types";
import { Gender, Religion, CivilStatus, Sector, ResidencyType } from "@prisma/client";

interface ResidentFormFieldsProps {
  editedResident: ResidentWithTypes;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string) => (value: string) => void;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (name: string, value: Date) => void;
  handleEmergencyContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAdmin?: boolean;
}

// Helper function to format enum values for display
const formatEnumValue = (value: string): string => {
  return value
    .split("_")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export default function ResidentFormFields({
  editedResident,
  handleInputChange,
  handleSelectChange,
  handleAddressChange,
  handleDateChange,
  handleEmergencyContactChange,
  isAdmin = false,
}: ResidentFormFieldsProps) {
  return (
    <div className="grid max-h-[60vh] gap-4 overflow-y-auto pb-4 pr-4">
      {/* Personal Information */}
      <h3 className="font-semibold">Personal Information</h3>
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
          value={editedResident.middleName || ""}
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

      {/* Admin-only fields */}
      {isAdmin && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select
              onValueChange={handleSelectChange("gender")}
              value={editedResident.gender}
            >
              <SelectTrigger className="w-[280px]" id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Gender).map(([key, value]) => (
                  <SelectItem key={key} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birthDate" className="text-right">
              Birth Date
            </Label>
            <DatePicker
              value={editedResident.birthDate ? new Date(editedResident.birthDate) : null}
              onChange={(date) => handleDateChange("birthDate", date!)}
            />
          </div>
        </>
      )}

      {/* Common fields */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={editedResident.email || ""}
          className="col-span-3"
          onChange={handleInputChange}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contact" className="text-right">
          Contact Number
        </Label>
        <Input
          id="contact"
          name="contact"
          value={editedResident.contact}
          className="col-span-3"
          onChange={handleInputChange}
        />
      </div>

      {/* Admin-only fields */}
      {isAdmin && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="religion" className="text-right">
              Religion
            </Label>
            <Select
              onValueChange={handleSelectChange("religion")}
              value={editedResident.religion ?? ""}
            >
              <SelectTrigger className="w-[280px]" id="religion">
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Religion).map(([key, value]) => (
                  <SelectItem key={key} value={value}>{formatEnumValue(value)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Civil Status
            </Label>
            <Select
              onValueChange={handleSelectChange("status")}
              value={editedResident.status}
            >
              <SelectTrigger className="w-[280px]" id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CivilStatus).map(([key, value]) => (
                  <SelectItem key={key} value={value}>{formatEnumValue(value)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sector" className="text-right">
              Sector
            </Label>
            <Select
              onValueChange={handleSelectChange("sector")}
              value={editedResident.sector ?? ""}
            >
              <SelectTrigger className="w-[280px]" id="sector">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Sector).map(([key, value]) => (
                  <SelectItem key={key} value={value}>{formatEnumValue(value)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      {/* Address Fields */}
      <h3 className="mt-4 font-semibold">Address Information</h3>
      
      {/* Admin-only fields */}
      {isAdmin && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="residencyType" className="text-right">
            Residency Type
          </Label>
          <Select
            onValueChange={handleSelectChange("address.residencyType")}
            value={editedResident.address?.residencyType}
          >
            <SelectTrigger className="w-[280px]" id="residencyType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ResidencyType).map(([key, value]) => (
                <SelectItem key={key} value={value}>{formatEnumValue(value)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Common address fields */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="blockLot" className="text-right">
          Block/Lot
        </Label>
        <Input
          id="blockLot"
          name="blockLot"
          value={editedResident.address?.blockLot || ""}
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
          value={editedResident.address?.phase || ""}
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
          value={editedResident.address?.street || ""}
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
          value={editedResident.address?.subdivision || ""}
          className="col-span-3"
          onChange={handleAddressChange}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="yearsInBahayToro" className="text-right">
          Years in Bahay Toro
        </Label>
        <Input
          id="yearsInBahayToro"
          name="yearsInBahayToro"
          type="number"
          value={editedResident.address?.yearsInBahayToro || ""}
          className="col-span-3"
          onChange={handleAddressChange}
        />
      </div>
      
      {/* Emergency Contact Fields */}
      <h3 className="mt-4 font-semibold">Emergency Contact</h3>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="emergencyName" className="text-right">
          Name
        </Label>
        <Input
          id="emergencyName"
          name="name"
          value={editedResident.emergencyContact?.name || ""}
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
          value={editedResident.emergencyContact?.relationship || ""}
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
          value={editedResident.emergencyContact?.contact || ""}
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
          value={editedResident.emergencyContact?.address || ""}
          className="col-span-3"
          onChange={handleEmergencyContactChange}
        />
      </div>
    </div>
  );
}