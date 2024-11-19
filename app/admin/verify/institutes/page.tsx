"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  FileCheck,
  Filter,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { InstituteTable } from "./InstituteTable";
import { StatsCard } from "./StatsCard";

export default function InstitutesVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10 px-6">
          <div className="flex flex-col gap-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Institute Verification
              </h1>
              <p className="text-gray-400 mt-2">
                Review and verify educational institution applications
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Pending Verifications"
                value="45"
                description="+5 from last week"
                icon={Clock}
                trend="up"
              />
              <StatsCard
                title="Approved Institutes"
                value="1,234"
                description="92% approval rate"
                icon={FileCheck}
                trend="up"
              />
              <StatsCard
                title="Rejected Applications"
                value="89"
                description="-2% this month"
                icon={XCircle}
                trend="down"
              />
              <StatsCard
                title="Avg. Response Time"
                value="2.5 days"
                description="Within SLA"
                icon={Calendar}
              />
            </div>

            {/* Filters Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search institutes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-800/50 border-gray-700"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Table Section */}
            <InstituteTable
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
