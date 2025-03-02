"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

const UploadPlacementData = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [placements, setPlacements] = useState([
    { studentId: "", position: "", salary: "", joiningDate: "" },
  ]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        setCompanies(data);
      } catch (error) {
        toast({ title: "Failed to fetch companies" });
      }
    };

    fetchCompanies();
  }, []);

  const updatePlacement = (index, field, value) => {
    setPlacements((prevPlacements) =>
      prevPlacements.map((placement, i) =>
        i === index ? { ...placement, [field]: value } : placement
      )
    );
  };

  const addRow = () => {
    setPlacements((prev) => [
      ...prev,
      { studentId: "", position: "", salary: "", joiningDate: "" },
    ]);
  };

  const submitData = async () => {
    if (!selectedCompany) return toast({ title: "Please select a company" });

    try {
      const res = await fetch("/api/institution-admin/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: selectedCompany, placements }),
      });

      const result = await res.json();
      toast({
        title: res.ok
          ? "Placement data uploaded successfully"
          : result.message || "Failed to upload data",
      });
    } catch (error) {
      toast({ title: "An error occurred" });
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 mt-10 shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Upload Placement Data</h2>
        <Label htmlFor="company">Select Company</Label>
        <Select onValueChange={setSelectedCompany}>
          <SelectTrigger>{selectedCompany || "Choose a company"}</SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {placements.map((placement, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mt-4">
            <Input
              placeholder="Student ID"
              value={placement.studentId}
              onChange={(e) =>
                updatePlacement(index, "studentId", e.target.value)
              }
            />
            <Input
              placeholder="Position"
              value={placement.position}
              onChange={(e) =>
                updatePlacement(index, "position", e.target.value)
              }
            />
            <Input
              placeholder="Salary"
              value={placement.salary}
              onChange={(e) => updatePlacement(index, "salary", e.target.value)}
            />
            <Input
              type="date"
              value={placement.joiningDate}
              onChange={(e) =>
                updatePlacement(index, "joiningDate", e.target.value)
              }
            />
          </div>
        ))}

        <Button onClick={addRow} className="mt-4 w-full">
          Add More Rows
        </Button>
        <Button onClick={submitData} className="mt-4 w-full bg-blue-600">
          Submit Placement Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default UploadPlacementData;
