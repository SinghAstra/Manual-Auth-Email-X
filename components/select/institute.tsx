import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Institution {
  id: string;
  name: string;
}

const SelectInstitute = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    Institution[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/institutions");

        if (!response.ok) {
          throw new Error("Failed to fetch institutions");
        }

        const data = await response.json();
        setInstitutions(data);
        setFilteredInstitutions(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Error loading institutions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  useEffect(() => {
    // Filter institutions based on search query
    if (searchQuery.trim() === "") {
      setFilteredInstitutions(institutions);
    } else {
      const filtered = institutions.filter((institution) =>
        institution.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInstitutions(filtered);
    }
  }, [searchQuery, institutions]);

  const handleInstitutionSelect = (institutionId: string) => {
    router.push(`/auth/profile/${role}/${institutionId}/upload-docs`);
  };

  const handleCreateInstitution = () => {
    router.push("/create-institute");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-xl rounded-md p-4 mt-4 space-y-6 border">
      <Input
        placeholder="Search institutions..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full bg-secondary/50"
      />

      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground py-4">
          Loading institutions...
        </div>
      ) : message ? (
        <div className="text-center text-sm text-destructive py-4">
          {message}
        </div>
      ) : filteredInstitutions.length > 0 ? (
        <div className="max-h-60 overflow-y-auto border border-secondary rounded-md">
          {filteredInstitutions.map((institution) => (
            <button
              key={institution.id}
              className="w-full text-left px-4 py-2 hover:bg-secondary/70 focus:outline-none focus:bg-secondary/70 transition"
              onClick={() => handleInstitutionSelect(institution.id)}
            >
              {institution.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <p className="mb-4 text-muted-foreground">No institutions found</p>
        </div>
      )}

      {!isLoading && !message && filteredInstitutions.length === 0 && (
        <div className="pt-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleCreateInstitution}
          >
            Create New Institution
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectInstitute;
