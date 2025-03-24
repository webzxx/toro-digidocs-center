"use client";
import React, { useState } from "react";
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
import { Edit, Eye, Trash2 } from "lucide-react";
import { ResidentWithTypes } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ResidentFormFields from "@/components/form/resident/ResidentFormFields";
import { useResidentForm } from "@/hooks/useResidentForm";

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
    isDirty,
  } = useResidentForm(resident);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedResident),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update resident");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["user-residents"] });
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
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete resident");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["user-residents"] });
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
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="flex gap-1 items-center p-0 w-10 min-[470px]:px-4 min-[470px]:py-2 min-[470px]:w-auto" onClick={handleViewCertificates}>
              <Eye className="size-4 flex-shrink-0" />
              <span className='sr-only min-[470px]:inline-block min-[470px]:not-sr-only'>View Certificates</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View certificates</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Edit Resident Dialog */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className='flex gap-1 items-center p-0 w-10 min-[510px]:px-4 min-[510px]:py-2 min-[510px]:w-auto'>
                  <Edit className="size-4" />
                  <span className='sr-only min-[510px]:inline-block min-[510px]:not-sr-only'>Edit</span>
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
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className='flex gap-1 items-center p-0 w-10 min-[565px]:px-4 min-[565px]:py-2 min-[565px]:w-auto'>
                  <Trash2 className="size-4" />
                  <span className='sr-only min-[565px]:inline-block min-[565px]:not-sr-only'>Delete</span>
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