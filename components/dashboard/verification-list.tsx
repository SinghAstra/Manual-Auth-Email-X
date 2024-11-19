import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const verifications = [
  {
    id: 1,
    name: "Tech Institute",
    type: "Institute",
    status: "pending",
    date: "2024-01-20",
    documents: 5,
  },
  {
    id: 2,
    name: "Global Corp Ltd",
    type: "Corporate",
    status: "approved",
    date: "2024-01-19",
    documents: 3,
  },
  {
    id: 3,
    name: "City College",
    type: "Institute",
    status: "rejected",
    date: "2024-01-18",
    documents: 4,
  },
];

export function VerificationList() {
  return (
    <div className="rounded-md border border-gray-800 bg-gray-900/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Documents</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verifications.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
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
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.documents}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
