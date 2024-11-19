import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { VerificationTable } from "@/components/dashboard/VerificationTable";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />

        <main className="py-10 px-6">
          <div className="flex flex-col gap-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-gray-400 mt-2">
                Monitor and manage verification requests from institutes and
                corporate.
              </p>
            </div>

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
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
