export interface EntityStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  trend: number;
}

export const stats = {
  institutes: {
    total: 1234,
    pending: 45,
    approved: 1150,
    rejected: 39,
    trend: 12.5,
  },
  corporates: {
    total: 892,
    pending: 23,
    approved: 845,
    rejected: 24,
    trend: 8.3,
  },
} as const;

export const recentVerifications = [
  {
    id: "ver_1",
    name: "Tech Institute of Science",
    type: "university",
    status: "pending",
    submittedAt: "2024-01-20T10:30:00Z",
    documents: {
      total: 3,
      verified: 1,
    },
  },
  {
    id: "ver_2",
    name: "Global Solutions Corp",
    type: "private",
    status: "approved",
    submittedAt: "2024-01-19T15:45:00Z",
    documents: {
      total: 4,
      verified: 4,
    },
  },
  {
    id: "ver_3",
    name: "City Engineering College",
    type: "technical",
    status: "rejected",
    submittedAt: "2024-01-18T09:15:00Z",
    documents: {
      total: 3,
      verified: 2,
    },
  },
] as const;
