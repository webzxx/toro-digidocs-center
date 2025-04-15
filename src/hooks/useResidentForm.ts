import { useState } from "react";
import { ResidentWithRelations } from "@/types/shared";

export function useResidentForm(initialResident: ResidentWithRelations) {
  const [editedResident, setEditedResident] = useState<ResidentWithRelations>(initialResident);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedResident(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setEditedResident(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedResident(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      } as Required<typeof prev.address>,
    }));
  };

  const handleDateChange = (name: string, value: Date) => {
    setEditedResident(prev => ({
      ...prev,
      [name]: value ? value.toISOString().split("T")[0] : "",
    }));
  };

  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedResident(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value,
      } as Required<typeof prev.emergencyContact>,
    }));
  };

  const resetForm = () => {
    setEditedResident(initialResident);
  };

  const isDirty = () => {
    return JSON.stringify(initialResident) !== JSON.stringify(editedResident);
  };

  return {
    editedResident,
    setEditedResident,
    handleInputChange,
    handleSelectChange,
    handleAddressChange,
    handleDateChange,
    handleEmergencyContactChange,
    resetForm,
    isDirty,
  };
}