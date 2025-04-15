import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserActions from "./UserActions";
import { formatDateTime } from "@/lib/utils";
  
interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  refetch?: () => void;
}
  
export default function UserTable({ users, isLoading, refetch }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">Role</TableHead>
          <TableHead className="hidden sm:table-cell">Created at</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users && users.length > 0 && (
          users.map((user) => (
            <TableRow key={user.id} className={isLoading ? "opacity-50" : ""}>
              <TableCell>
                <div className="font-medium">{user.username}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.email.length > 20 ? (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          {user.email.slice(0, 20)}...
                        </TooltipTrigger>

                        <TooltipContent className="max-w-xs">
                          <div>{user.email}</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className="text-xs" variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatDateTime(user.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <UserActions 
                  userId={user.id.toString()} 
                  username={user.username} 
                  email={user.email} 
                  role={user.role} 
                  refetch={refetch} 
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
