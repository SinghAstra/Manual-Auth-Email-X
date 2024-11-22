"use client";

import Header from "@/components/layout/admin/Header";
import Sidebar from "@/components/layout/admin/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10 px-6">
          <div className="flex flex-col gap-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-gray-400 mt-2">{description}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
