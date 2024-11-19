import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { recentVerifications } from "@/lib/data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FileText, MoreHorizontal } from "lucide-react";

export function VerificationTable() {
  return (
    <div className="rounded-md border border-gray-800 bg-gray-900/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entity Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentVerifications.map((item) => (
            <TableRow key={item.id} className="group">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="capitalize">{item.type}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    item.status === "approved" &&
                      "border-green-500 text-green-500",
                    item.status === "rejected" && "border-red-500 text-red-500",
                    item.status === "pending" &&
                      "border-yellow-500 text-yellow-500"
                  )}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(item.submittedAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span>
                    {item.documents.verified}/{item.documents.total}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Approve</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
