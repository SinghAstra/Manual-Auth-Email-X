import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  InboxIcon,
  XCircle,
} from "lucide-react";

const filters = [
  {
    label: "All Requests",
    icon: InboxIcon,
    value: "all",
  },
  {
    label: "Pending Review",
    icon: Clock,
    value: "pending",
  },
  {
    label: "Needs Info",
    icon: AlertCircle,
    value: "info-required",
  },
  {
    label: "Recently Approved",
    icon: CheckCircle,
    value: "approved",
  },
  {
    label: "Recently Rejected",
    icon: XCircle,
    value: "rejected",
  },
];

export function QuickFilters() {
  return (
    <Card className="bg-gray-900/60 border-gray-800">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800"
            >
              <filter.icon className="mr-2 h-4 w-4" />
              {filter.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
