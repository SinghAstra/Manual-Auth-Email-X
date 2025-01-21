import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, GraduationCap, LucideIcon, Users } from "lucide-react";

// components/stats-card.tsx
interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <div className="p-6 flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  );
}

// components/verification-item.tsx
interface VerificationItemProps {
  verification: {
    id: string;
    name: string;
    email: string;
    role: string;
    documents: { type: string; fileUrl: string }[];
    createdAt: Date;
  };
}

export function VerificationItem({ verification }: VerificationItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <h3 className="font-medium">{verification.name}</h3>
        <p className="text-sm text-muted-foreground">{verification.email}</p>
        <p className="text-sm">Role: {verification.role}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          View Documents
        </Button>
        <Button variant="default" size="sm">
          Verify
        </Button>
      </div>
    </div>
  );
}

// app/(admin)/admin/dashboard/page.tsx
export default function AdminDashboard() {
  // Static data for now
  const stats = {
    totalUsers: 1250,
    totalInstitutions: 45,
    totalCompanies: 78,
    totalPlacements: 856,
  };

  const pendingVerifications = [
    {
      id: "1",
      name: "John Doe",
      email: "john@university.edu",
      role: "INSTITUTION_ADMIN",
      documents: [
        { type: "INSTITUTION_ID", fileUrl: "/docs/1" },
        { type: "AUTHORIZATION_LETTER", fileUrl: "/docs/2" },
      ],
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@techcorp.com",
      role: "COMPANY_REPRESENTATIVE",
      documents: [
        { type: "COMPANY_ID", fileUrl: "/docs/3" },
        { type: "BUSINESS_CARD", fileUrl: "/docs/4" },
      ],
      createdAt: new Date(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatsCard
          title="Total Institutions"
          value={stats.totalInstitutions}
          icon={Building2}
        />
        <StatsCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={Building2}
        />
        <StatsCard
          title="Successful Placements"
          value={stats.totalPlacements}
          icon={GraduationCap}
        />
      </div>

      {/* Pending Verifications */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pending Verifications</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {pendingVerifications.map((verification) => (
            <VerificationItem
              key={verification.id}
              verification={verification}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
