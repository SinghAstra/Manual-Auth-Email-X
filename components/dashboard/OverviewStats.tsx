import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EntityStats } from "@/lib/data";
import { Building2, CheckCircle2, GraduationCap, XCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  stats: EntityStats;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, stats, icon: Icon }: StatCardProps) {
  const approvalRate = ((stats.approved / stats.total) * 100).toFixed(1);

  return (
    <Card className="bg-gray-900/60 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-200">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-gray-400">Total Registered</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-green-500">
              +{stats.trend}%
            </p>
            <p className="text-xs text-gray-400">vs last month</p>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={Number(approvalRate)} className="h-1" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{approvalRate}% Approved</span>
            <span>{stats.pending} Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Institutes"
        stats={{
          total: 1234,
          pending: 45,
          approved: 1150,
          rejected: 39,
          trend: 12.5,
        }}
        icon={GraduationCap}
      />
      <StatCard
        title="Corporate"
        stats={{
          total: 892,
          pending: 23,
          approved: 845,
          rejected: 24,
          trend: 8.3,
        }}
        icon={Building2}
      />
      <Card className="bg-gray-900/60 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Verification Rate
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94.3%</div>
          <CardDescription className="text-green-500">
            +2.1% from last month
          </CardDescription>
          <Progress value={94.3} className="h-1 mt-3" />
        </CardContent>
      </Card>
      <Card className="bg-gray-900/60 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Rejection Rate
          </CardTitle>
          <XCircle className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5.7%</div>
          <CardDescription className="text-red-500">
            +0.8% from last month
          </CardDescription>
          <Progress value={5.7} className="h-1 mt-3 bg-gray-800">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: "5.7%" }}
            />
          </Progress>
        </CardContent>
      </Card>
    </div>
  );
}
