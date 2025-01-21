import { CheckCircle2, Clock, XCircle } from "lucide-react";
import React from "react";

type HandledStatuses = "PENDING" | "APPROVED" | "REJECTED";

const StatusCard = ({ status }: { status: HandledStatuses }) => {
  const statusConfig = {
    PENDING: {
      icon: Clock,
      title: "Verification In Progress",
      description:
        "Your documents are currently under review. We'll notify you once the verification is complete.",
      color: "text-[hsl(var(--stats-orange))]",
      bgColor: "bg-[hsl(var(--stats-orange)_/_0.1)]",
    },
    APPROVED: {
      icon: CheckCircle2,
      title: "Verification Approved",
      description:
        "Congratulations! Your documents have been verified successfully.",
      color: "text-[hsl(var(--stats-green))]",
      bgColor: "bg-[hsl(var(--stats-green)_/_0.1)]",
    },
    REJECTED: {
      icon: XCircle,
      title: "Verification Rejected",
      description:
        "Unfortunately, your documents did not meet our verification requirements. Please submit new documents.",
      color: "text-[hsl(var(--stats-red))]",
      bgColor: "bg-[hsl(var(--stats-red)_/_0.1)]",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className=" rounded-md border bg-card/50 backdrop-blur-lg py-2">
      <div className="pt-6">
        <div
          className={`flex flex-col items-center justify-center space-y-4 text-center ${config.color}`}
        >
          <div className={`p-3 rounded-full ${config.bgColor}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{config.title}</h3>
            <p className="text-muted-foreground max-w-sm">
              {config.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
