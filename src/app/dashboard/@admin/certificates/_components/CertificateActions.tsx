"use client";

import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from "lucide-react";
import { deleteCertificateRequest, updateCertificateRequest } from "@/app/dashboard/@admin/certificates/actions";
import { CertificateStatus } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

interface CertificateActionsProps {
  certificateId: number;
  referenceNumber: string;
  purpose: string;
  status: string;
  remarks?: string;
  refetch: () => void;
}

export default function CertificateActions({
  certificateId,
  referenceNumber,
  purpose,
  status,
  remarks = "",
  refetch,
}: CertificateActionsProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [editedPurpose, setEditedPurpose] = useState<string>(purpose);
  const [editedStatus, setEditedStatus] = useState<string>(status);
  const [editedRemarks, setEditedRemarks] = useState<string>(remarks || "");
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);

  useEffect(() => {
    if (!isEditDialogOpen || !isStatusSelectOpen) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
    }
    
    return () => {
      document.body.style.pointerEvents = "";
    };
  }, [isEditDialogOpen, isStatusSelectOpen]);

  const handleEditedPurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPurpose(e.target.value);
  };

  const handleEditedStatusChange = (selected: string) => {
    setEditedStatus(selected);
  };

  const handleEditedRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedRemarks(e.target.value);
  };

  const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteConfirmation(e.target.value);
  };

  const handleEditCertificate = async () => {
    if (purpose === editedPurpose && status === editedStatus && remarks === editedRemarks) return;
    try {
      await updateCertificateRequest(certificateId, {
        purpose: editedPurpose,
        status: editedStatus,
        remarks: editedRemarks,
      });
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificate-requests-for-payment"] });
      refetch();
      toast({
        title: "Certificate updated",
        description: `Certificate ${referenceNumber} has been successfully updated.`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating the certificate.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCertificate = async () => {
    try {
      await deleteCertificateRequest(certificateId);
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificate-requests-for-payment"] });
      refetch();
      toast({
        title: "Certificate deleted",
        description: `Certificate ${referenceNumber} has been permanently deleted.`,
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was a problem deleting the certificate.",
        variant: "destructive",
      });
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setDeleteConfirmation("");
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
    }
  };

  const handleEditCloseButtonClick = () => {
    setIsEditDialogOpen(false);
    document.body.style.pointerEvents = "";
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 100);
  };

  const handleDeleteCloseButtonClick = () => {
    setIsDeleteDialogOpen(false);
    setDeleteConfirmation("");
    document.body.style.pointerEvents = "";
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 100);
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h2>{referenceNumber}</h2>
            <DialogDescription>Update certificate request information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purpose" className="text-right">
                Purpose
              </Label>
              <Input
                id="purpose"
                defaultValue={purpose}
                className="col-span-3"
                onChange={handleEditedPurposeChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={handleEditedStatusChange}
                defaultValue={status}
                onOpenChange={setIsStatusSelectOpen}
              >
                <SelectTrigger className="w-[180px]" id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CertificateStatus).map(([value]) => (
                    <SelectItem key={value} value={value}>
                      {value.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remarks" className="text-right">
                Remarks
                {editedStatus === "REJECTED" && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </Label>
              <Textarea
                id="remarks"
                placeholder={editedStatus === "REJECTED" ? "Please provide a reason for rejection" : "Add any additional comments here"}
                className="col-span-3"
                value={editedRemarks}
                onChange={handleEditedRemarksChange}
                required={editedStatus === "REJECTED"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleEditCloseButtonClick}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleEditCertificate}
              disabled={editedStatus === "REJECTED" && !editedRemarks.trim()}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h2>{referenceNumber}</h2>
            <DialogDescription>
              <span className="font-bold text-red-600">This action cannot be undone!</span> This will <span className="font-bold text-red-600">permanently delete</span> the certificate request with reference number <b>{referenceNumber}</b>. Please review carefully before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmDelete" className="text-right">
                Confirm reference number
              </Label>
              <Input
                id="confirmDelete"
                defaultValue=""
                placeholder="Type reference number to confirm"
                className="col-span-3"
                onChange={handleDeleteChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleDeleteCloseButtonClick}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="submit"
              disabled={deleteConfirmation !== referenceNumber}
              onClick={handleDeleteCertificate}
            >
              Delete Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}