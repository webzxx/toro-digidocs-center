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
import { deleteCertificateRequest, updateCertificateRequest } from '@/app/dashboard/certificates/actions';

interface CertificateActionsProps {
  certificateId: number;
  referenceNumber: string;
  certificateType: string;
  purpose: string;
  status: string;
  onReload: () => void;
}

export default function CertificateActions({
  certificateId,
  referenceNumber,
  certificateType,
  purpose,
  status,
  onReload,
}: CertificateActionsProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [editedPurpose, setEditedPurpose] = useState<string>(purpose);
  const [editedStatus, setEditedStatus] = useState<string>(status);

  const handleEditedPurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPurpose(e.target.value);
  };

  const handleEditedStatusChange = (selected: string) => {
    setEditedStatus(selected);
  };

  const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteConfirmation(e.target.value);
  };

  const handleEditCertificate = () => {
    if (purpose === editedPurpose && status === editedStatus) return;
    const id = parseInt(certificateId);
    const updatedData = {
      purpose: editedPurpose,
      status: editedStatus,
    };
    updateCertificateRequest(id, updatedData);
    onReload();
  };

  const handleDeleteCertificate = () => {
    const id = parseInt(certificateId);
    deleteCertificateRequest(id);
    onReload();
  };

  return (
    <div className="flex gap-2">
      <Dialog>
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
              >
                <SelectTrigger className="w-[180px]" id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                  <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={handleEditCertificate}>
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
            <h2>{referenceNumber}</h2>
            <DialogDescription>
              Delete certificate request <b>{certificateId}</b>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmDelete" className="text-right">
                Confirm reference number
              </Label>
              <Input
                id="confirmDelete"
                value={deleteConfirmation}
                placeholder="Type reference number to confirm"
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
                disabled={deleteConfirmation !== referenceNumber}
                onClick={handleDeleteCertificate}
              >
                Delete Certificate
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}