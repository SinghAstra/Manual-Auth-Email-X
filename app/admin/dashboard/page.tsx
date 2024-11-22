import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { VerificationTable } from "@/components/dashboard/VerificationTable";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  return (
    <AdminLayout
      title="Dashboard"
      description="Monitor and manage verification requests from institutes and corporate."
    >
      <OverviewStats />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Verifications
          </h2>
          <Button variant="outline" className="text-xs">
            View All
          </Button>
        </div>
        <VerificationTable />
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
