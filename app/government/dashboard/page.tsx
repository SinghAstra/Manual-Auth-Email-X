"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const placedStudentChartConfig = {
  desktop: {
    label: "Placed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const unplacedStudentChartConfig = {
  desktop: {
    label: "Placed",
    color: "hsl(var(--chart-1))",
  },
};

const jobData = [
  { department: "CS", placed: 120, unplaced: 30 },
  { department: "ME", placed: 90, unplaced: 40 },
  { department: "EE", placed: 150, unplaced: 20 },
  { department: "EC", placed: 80, unplaced: 50 },
  { department: "CE", placed: 110, unplaced: 60 },
];

const GovernmentDashboard = () => {
  return (
    <div className="flex p-4 gap-4">
      <Card className="flex flex-col flex-1 border rounded-md p-2">
        <CardHeader className="items-center pb-0">
          <CardTitle>Placement by Department</CardTitle>
          <CardDescription>
            Overview of placements per department
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 py-4">
          <ChartContainer config={placedStudentChartConfig}>
            <BarChart data={jobData}>
              <CartesianGrid vertical={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <Bar
                dataKey="placed"
                fill="hsl(var(--chart-1))"
                barSize={50}
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm text-center">
          <div className="leading-none text-muted-foreground">
            Data fetched from placement records, grouped by department
          </div>
        </CardFooter>
      </Card>
      <Card className="flex flex-col flex-1 border rounded-md p-2">
        <CardHeader className="items-center pb-0">
          <CardTitle>Non Placed Student by Department</CardTitle>
          <CardDescription>
            Overview of non-placements per department
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 py-4">
          <ChartContainer config={unplacedStudentChartConfig}>
            <BarChart data={jobData}>
              <CartesianGrid vertical={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <Bar
                dataKey="unplaced"
                fill="hsl(var(--chart-1))"
                barSize={50}
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm text-center">
          <div className="leading-none text-muted-foreground">
            Data fetched from placement records, grouped by department
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GovernmentDashboard;
