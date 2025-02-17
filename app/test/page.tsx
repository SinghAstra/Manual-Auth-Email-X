"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Institution } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  onExistingInstitutionSelect: (institutionId: string) => void;
  onNewInstitutionSubmit: (data: InstitutionFormData) => void;
}

interface InstitutionFormData {
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  website?: string;
}

const InstitutionSearchForm = ({
  onExistingInstitutionSelect,
  onNewInstitutionSubmit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [showNewInstitutionForm, setShowNewInstitutionForm] = useState(false);

  // Fetch institutions as user types
  const searchInstitutions = async (query: string) => {
    if (query.length < 2) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/institutions/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setInstitutions(data);
    } catch (error) {
      console.error("Failed to fetch institutions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
    setOpen(false);
    onExistingInstitutionSelect(institution.id);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Select Your Institution</h2>
        <p className="text-sm text-muted-foreground">
          Search for your institution or create a new one if it doesn&apos;t
          exist
        </p>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedInstitution
              ? selectedInstitution.name
              : "Search institutions..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput onValueChange={searchInstitutions} />
            <CommandEmpty>
              {loading ? (
                "Searching..."
              ) : (
                <div className="py-4 text-center space-y-2">
                  <p>No institution found</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      setShowNewInstitutionForm(true);
                    }}
                  >
                    Create New Institution
                  </Button>
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {institutions.map((institution) => (
                <CommandItem
                  key={institution.id}
                  value={institution.id}
                  onSelect={() => handleInstitutionSelect(institution)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedInstitution?.id === institution.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{institution.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {institution.city}, {institution.state}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {showNewInstitutionForm && (
        <NewInstitutionForm
          onSubmit={onNewInstitutionSubmit}
          onCancel={() => setShowNewInstitutionForm(false)}
        />
      )}
    </div>
  );
};

// Separate component for creating new institution
const NewInstitutionForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: InstitutionFormData) => void;
  onCancel: () => void;
}) => {
  const form = useForm<InstitutionFormData>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(2),
        type: z.string().min(2),
        address: z.string().min(10),
        city: z.string().min(2),
        state: z.string().min(2),
        website: z.string().url().optional(),
      })
    ),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Your existing form fields here */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Institution</Button>
      </div>
    </form>
  );
};

export default InstitutionSearchForm;
