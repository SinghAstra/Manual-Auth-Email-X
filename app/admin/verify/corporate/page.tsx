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
import { CorporateTable } from "./CorporateTable";
import { QuickFilters } from "./QuickFilters";
import { StatsCard } from "./StatsCard";

const CorporateVerificationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("7");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10 px-6">
          <div className="flex flex-col gap-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Corporate Verification
              </h1>
              <p className="text-gray-400 mt-2">
                Review and verify company verification requests
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Pending Requests"
                value="18"
                description="+2.5% from last week"
                icon={Clock}
                trend="up"
              />
              <StatsCard
                title="Verified Companies"
                value="245"
                description="+12.3% this month"
                icon={FileCheck}
                trend="up"
              />
              <StatsCard
                title="Average Time"
                value="1.8 days"
                description="-0.5 days vs target"
                icon={Calendar}
                trend="down"
              />
              <StatsCard
                title="Rejected"
                value="15"
                description="-4.2% this month"
                icon={XCircle}
                trend="down"
              />
            </div>

            {/* Quick Filters */}
            <QuickFilters />

            {/* Filters Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search companies..."
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
                    <SelectItem value="info-required">Info Required</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700">
                    <SelectValue placeholder="Company Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
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
                    setTimeFilter("7");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Table Section */}
            <CorporateTable
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CorporateVerificationPage;
