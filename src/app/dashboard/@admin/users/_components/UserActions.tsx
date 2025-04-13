"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Delete, Edit } from "lucide-react";
import React, { useState } from "react";

import { updateUser, deleteUser } from "@/app/dashboard/@admin/users/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { UserRole } from "@prisma/client";

interface UserActionsProps {
  userId: string;
  username: string;
  email: string;
  role: string;
  refetch?: () => void;
}

export default function UserActions({
  userId,
  username,
  email,
  role,
  refetch,
}: UserActionsProps) {
  const { toast } = useToast();
  const [deleteUserId, setDeleteUserId] = useState<string>("");
  const [editedUsername, setEditedUsername] = useState<string>(username);
  const [editedEmail, setEditedEmail] = useState<string>(email);
  const [editedRole, setEditedRole] = useState<string>(role);
  const queryClient = useQueryClient();

  const handleEditedEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEmail(e.target.value);
  };

  const handleEditedUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedUsername(e.target.value);
  };

  const handleEditedRoleChange = (selected: string) => {
    setEditedRole(selected);
  };

  const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteUserId(e.target.value);
  };

  const handleEditUser = async () => {
    if (
      username === editedUsername &&
      email === editedEmail &&
      role === editedRole
    )
      return;
    
    try {
      const id = parseInt(userId);
      const updatedData = {
        username: editedUsername,
        email: editedEmail,
        role: editedRole,
      };
      await updateUser(id, updatedData);
      
      // Invalidate queries and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (refetch) refetch();
      
      toast({
        title: "User updated",
        description: `User ${username} has been successfully updated.`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating the user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const id = parseInt(userId);
      await deleteUser(id);
      
      // Invalidate queries and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (refetch) refetch();
      
      toast({
        title: "User deleted",
        description: `User ${username} has been permanently deleted.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was a problem deleting the user.",
        variant: "destructive",
      });
    }
  };

  return (
    // Provide options to edit or delete user
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h2>{username}</h2>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                defaultValue={email}
                className="col-span-3"
                onChange={handleEditedEmailChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue={username}
                className="col-span-3"
                onChange={handleEditedUsernameChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                onValueChange={handleEditedRoleChange}
                defaultValue={role}
              >
                <SelectTrigger className="w-[180px]" id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={handleEditUser}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {role !== "ADMIN" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Delete className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <h2>{username}</h2>
              <DialogDescription>
                <span className="font-bold text-red-600">This action cannot be undone!</span> This will <span className="font-bold text-red-600">permanently delete</span> the user account and all residents created by {username} (User ID: {userId}). Please review carefully before proceeding.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userId" className="text-right">
                  Confirm user ID
                </Label>
                <Input
                  id="userId"
                  value={deleteUserId}
                  placeholder="Type user ID to confirm"
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
                  disabled={deleteUserId !== userId}
                  onClick={handleDeleteUser}
                >
                  Delete User
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
