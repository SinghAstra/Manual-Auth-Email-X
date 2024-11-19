import { StatsCard } from "@/components/dashboard/stats-card";
import { VerificationList } from "@/components/dashboard/verification-list";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Activity, Building2, FileCheck, Users } from "lucide-react";

function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10 px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Registrations"
              value="2,345"
              description="+20.1% from last month"
              icon={Building2}
              trend="up"
            />
            <StatsCard
              title="Pending Verifications"
              value="45"
              description="12 added today"
              icon={FileCheck}
            />
            <StatsCard
              title="Active Users"
              value="1,274"
              description="+10.5% from last week"
              icon={Users}
              trend="up"
            />
            <StatsCard
              title="Rejection Rate"
              value="4.3%"
              description="-2.1% from last month"
              icon={Activity}
              trend="down"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Recent Verifications
            </h2>
            <VerificationList />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
