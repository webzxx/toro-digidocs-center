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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Trash2 } from 'lucide-react';
import { ResidentWithTypes } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import ResidentFormFields from './ResidentFormFields';
import { useResidentForm } from '@/lib/useResidentForm';

interface UserResidentActionsProps {
  resident: ResidentWithTypes;
}

export default function UserResidentActions({ resident }: UserResidentActionsProps) {
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

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleViewCertificates = () => {
    // Redirect to certificates page filtered by this resident
    router.push(`/dashboard/certificates?residentId=${resident.id}`);
  };

  const handleEditResident = async () => {
    if (!isDirty()) {
      setIsEditDialogOpen(false);
      return;
    }
    
    try {
      // Call API to update resident
      const response = await fetch(`/api/user/residents/${resident.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedResident),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update resident');
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['user-residents'] });
      toast({
        title: "Success",
        description: "Resident updated successfully",
      });
      setIsEditDialogOpen(false);
      
      // Force a refresh of the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to update resident:", error);
      toast({
        title: "Error",
        description: "Failed to update resident",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResident = async () => {
    if (deleteConfirmation !== resident.bahayToroSystemId) {
      toast({
        title: "Error",
        description: "ID confirmation doesn't match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Call API to delete resident
      const response = await fetch(`/api/user/residents/${resident.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete resident');
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['user-residents'] });
      toast({
        title: "Success",
        description: "Resident deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setDeleteConfirmation("");
      
      // Force a refresh of the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to delete resident:", error);
      toast({
        title: "Error",
        description: "Failed to delete resident",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      {/* View Certificates Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleViewCertificates}>
              <Eye className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View certificates</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Edit Resident Dialog */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
                  <h2>Edit Profile: {resident.firstName} {resident.lastName}</h2>
                  <DialogDescription>Update resident information</DialogDescription>
                </DialogHeader>
                
                <ResidentFormFields
                  editedResident={editedResident}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handleAddressChange={handleAddressChange}
                  handleDateChange={handleDateChange}
                  handleEmergencyContactChange={handleEmergencyContactChange}
                  isAdmin={false}
                />
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleEditResident}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit profile</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Delete Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <h2 className="text-xl font-semibold">Delete Resident Profile</h2>
                  <DialogDescription>
                    <span className="text-red-600 font-bold">This action cannot be undone!</span> This will permanently delete the profile for {resident.firstName} {resident.lastName} and all associated records.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Please type <span className="font-medium">{resident.bahayToroSystemId}</span> to confirm deletion.
                  </p>
                  <Input
                    placeholder={`Type ${resident.bahayToroSystemId} to confirm`}
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleDeleteResident}
                    disabled={deleteConfirmation !== resident.bahayToroSystemId}
                  >
                    Delete Profile
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete profile</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}