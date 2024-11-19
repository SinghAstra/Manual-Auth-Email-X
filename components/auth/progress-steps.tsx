"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

const ProgressSteps = ({ currentStep, steps }: ProgressStepsProps) => {
  return (
    <div className="space-y-2 mb-4">
      <div className="relative">
        <div className="absolute left-0 top-2 h-0.5 w-full bg-gray-900">
          <div
            className="absolute h-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index + 1;
            const isCurrent = currentStep === index + 1;

            return (
              <div key={step.title} className="flex flex-col items-center">
                <div
                  className={cn(
                    "z-10 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200",
                    isCompleted && "bg-primary",
                    isCurrent && "border-2 border-primary bg-background",
                    !isCompleted &&
                      !isCurrent &&
                      "border-2 border-muted bg-background"
                  )}
                >
                  {isCompleted && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <div className=" mt-8 w-32 text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
