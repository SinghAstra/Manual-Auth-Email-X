import { formatDocumentType } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { DocumentFile } from "./institution-admin-form";

enum CompanyRepresentativeDocumentsType {
  COMPANY_ID = "COMPANY_ID",
  BUSINESS_CARD = "BUSINESS_CARD",
}

type CompanyRepresentativeDocumentsFiles = {
  [key in CompanyRepresentativeDocumentsType]?: DocumentFile;
};

const CompanyRepresentativeForm = () => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const fileInputRefs = useRef<
    Record<CompanyRepresentativeDocumentsType, HTMLInputElement | null>
  >({
    [CompanyRepresentativeDocumentsType.COMPANY_ID]: null,
    [CompanyRepresentativeDocumentsType.BUSINESS_CARD]: null,
  });

  const [documents, setDocuments] =
    useState<CompanyRepresentativeDocumentsFiles>({
      [CompanyRepresentativeDocumentsType.COMPANY_ID]: {
        file: null,
        preview: null,
        error: null,
      },
      [CompanyRepresentativeDocumentsType.BUSINESS_CARD]: {
        file: null,
        preview: null,
        error: null,
      },
    });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: CompanyRepresentativeDocumentsType
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setDocuments((prev) => ({
        ...prev,
        [type]: {
          file,
          preview: previewUrl,
          error: null,
        },
      }));
    }
  };

  const removeDocument = (type: CompanyRepresentativeDocumentsType) => {
    const currentPreview = documents[type]?.preview;
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    setDocuments((prev) => ({
      ...prev,
      [type]: {
        file: null,
        preview: null,
        error: null,
      },
    }));

    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type].value = "";
    }
  };

  const validateDocuments = (): boolean => {
    let isValid = true;

    Object.values(CompanyRepresentativeDocumentsType).forEach((type) => {
      if (!documents[type]?.file) {
        setDocuments((prev) => ({
          ...prev,
          [type]: {
            file: null,
            preview: null,
            error: `${formatDocumentType(type)} is required`,
          },
        }));
        isValid = false;
      } else {
        setDocuments((prev) => ({
          ...prev,
          [type]: {
            ...documents[type],
            error: null,
          },
        }));
      }
    });

    console.log("isValid is ", isValid);
    console.log("documents is ", documents);

    return isValid;
  };

  const formSchema = z.object({
    companyName: z.string().min(2),
    website: z.union([z.literal(""), z.string().trim().url()]),
    address: z.string(),
    city: z.string(),
    state: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      website: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // Validate documents
    const isValidDocuments = validateDocuments();

    if (!isValidDocuments) {
      return;
    }

    setIsFormSubmitting(true);
    // Handle form submission
  };

  return (
    <div className="w-full max-w-xl border rounded-md py-2 px-4 mt-4">
      <div className="mb-4">
        <h2 className="text-2xl">Company Representative Profile</h2>
        <span className="text-sm text-muted-foreground">
          Provide your company and role details
        </span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm transition-colors font-normal">
                  Company Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm transition-colors font-normal">
                  Address
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter complete address" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    State
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm transition-colors font-normal">
                  Website (Optional)
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter institution website" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {Object.values(CompanyRepresentativeDocumentsType).map((type) => (
            <div key={type}>
              <FormLabel
                className={`text-sm transition-colors font-normal ${
                  documents[type] && documents[type].error
                    ? "text-destructive"
                    : ""
                }`}
              >
                {formatDocumentType(type)}
              </FormLabel>
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, type)}
                  className={`w-full cursor-pointer ${
                    documents[type] && documents[type].error
                      ? "border-destructive"
                      : ""
                  }`}
                  ref={(el) => {
                    fileInputRefs.current[type] = el;
                  }}
                />
              </div>
              {documents[type]?.preview && (
                <div className="mt-2 relative">
                  <div className="relative w-full h-40 border rounded-md overflow-hidden">
                    {documents[type]?.file?.type.startsWith("image/") ? (
                      <Image
                        src={documents[type]?.preview}
                        alt={`${type} Preview`}
                        width={320}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <p className="text-sm text-muted-foreground">
                          PDF Document
                        </p>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeDocument(
                          type as CompanyRepresentativeDocumentsType
                        )
                      }
                      className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-md hover:bg-accent transition-colors"
                    >
                      <X className="h-4 w-4 text-foreground" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={isFormSubmitting}>
            {isFormSubmitting ? (
              <>
                <FaSpinner className="animate-spin" /> Wait ....
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyRepresentativeForm;
