import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { User, UserRole } from "@prisma/client";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@radix-ui/react-tooltip";
  import UserActions from "./UserActions";
import { formatDate } from "@/lib/utils";
import CreateUserButton from "./CreateUserButton";
  
  interface UserTableProps {
    users?: User[];
  }
  
  export default function UserTable({ users }: UserTableProps) {
    return (
      <Card>
        <CardHeader className="px-7 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>List of Barangay Bahay Taro users.</CardDescription>
          </div>
          <CreateUserButton />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden sm:table-cell">Password</TableHead>
                <TableHead className="hidden sm:table-cell">Created at</TableHead>
                <TableHead className="hidden sm:table-cell">Updated at</TableHead>
                <TableHead className="hidden sm:table-cell">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 && (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.username}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {user.email.length > 20 ? (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {user.email.slice(0, 20)}...
                              </TooltipTrigger>
  
                              <TooltipContent className="w-60 whitespace-normal text-wrap break-words rounded-md bg-background p-2 shadow-md">
                                <div>{user.email}</div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      ) : (
                        user.email
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant="secondary">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                       <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {user.password.slice(0, 5)}...
                          </TooltipTrigger>
  
                          <TooltipContent className="w-60 whitespace-normal text-wrap break-words rounded-md bg-background p-2 shadow-md">
                            <div>{user.password}</div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(user.updatedAt)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <UserActions userId={user.id.toString()} username={user.username} email={user.email} role={user.role} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  