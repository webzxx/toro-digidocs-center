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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from 'lucide-react';
import { deleteResident, updateResident } from '@/app/dashboard/@admin/residents/actions';
import { ResidentWithTypes } from '@/types/types';
import { titleCase } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import ResidentFormFields from './ResidentFormFields';
import { useResidentForm } from '@/lib/useResidentForm';

interface ResidentActionsProps {
  resident: ResidentWithTypes;
}

export default function ResidentActions({ resident }: ResidentActionsProps) {
  const {
    editedResident,
    handleInputChange,
    handleSelectChange,
    handleAddressChange,
    handleDateChange,
    handleEmergencyContactChange,
    resetForm,
    isDirty
  } = useResidentForm(resident);

  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteConfirmation(e.target.value);
  };

  const handleEditResident = async () => {
    if (!isDirty()) {
      setIsEditDialogOpen(false);
      return;
    }
    
    try {
      await updateResident(resident.id, editedResident);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast({
        title: "Resident updated",
        description: `Resident ${editedResident.bahayToroSystemId} has been successfully updated.`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update resident:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the resident.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResident = async () => {
    try {
      await deleteResident(resident.id);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast({
        title: "Resident deleted",
        description: `Resident ${resident.bahayToroSystemId} has been permanently deleted.`,
      });
      setIsDeleteDialogOpen(false);
      setDeleteConfirmation("");
    } catch (error) {
      console.error("Failed to delete resident:", error);
      toast({
        title: "Delete failed",
        description: "There was a problem deleting the resident.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) resetForm();
      }}>
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
          
          <ResidentFormFields
            editedResident={editedResident}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleAddressChange={handleAddressChange}
            handleDateChange={handleDateChange}
            handleEmergencyContactChange={handleEmergencyContactChange}
            isAdmin={true}
          />
          
          <DialogFooter>
            <Button type="submit" onClick={handleEditResident}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h2>{resident.bahayToroSystemId}</h2>
            <DialogDescription>
              <span className="text-red-600 font-bold">This action cannot be undone!</span> This will <span className="text-red-600 font-bold">delete all records</span> related to the resident, {titleCase(`${resident.firstName} ${resident.lastName}`)}. Please review carefully before proceeding.
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
            <Button
              variant="destructive"
              type="submit"
              disabled={deleteConfirmation !== resident.bahayToroSystemId}
              onClick={handleDeleteResident}
            >
              Delete Resident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}