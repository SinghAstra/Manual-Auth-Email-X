export type ApprovalStatus = {
  status: "pending" | "approved" | "rejected";
  submissionDate: string;
  estimatedTime: string;
  type: "institution" | "corporate";
  reference: string;
  lastUpdated: string;
  notes?: string;
};

// Simulated API response
export const getApprovalStatus = async (): Promise<ApprovalStatus> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    status: "pending",
    submissionDate: "2024-03-20T10:30:00Z",
    estimatedTime: "48 hours",
    type: "institution",
    reference: "REF-2024-0123",
    lastUpdated: "2024-03-20T10:30:00Z",
    notes: "Your application is currently under review by our team.",
  };
};
