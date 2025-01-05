import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return "border-green-500 text-green-500  hover:bg-green-50/20";
      case "PENDING":
        return "border-yellow-500 text-yellow-500 hover:bg-yellow-50/20";
      default:
        return "border-gray-500 text-gray-500 bg-gray-50/10 hover:bg-gray-50/20";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border transition-colors",
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </Badge>
  );
}
