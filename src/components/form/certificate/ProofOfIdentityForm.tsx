import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SignaturePad from "react-signature-pad-wrapper";
import { StepperFormActions } from "./StepperFormActions";
import Image from "next/image";
import { ProofOfIdentityInput, proofOfIdentitySchema } from "@/types/types";
import { useStepper } from "../../ui/stepper";

type ImageFile = {
  file: File;
  preview: string;
};

type ImageCategory = "photoId" | "photoHoldingId";

export interface ProofOfIdentityFormProps {
  data: Partial<ProofOfIdentityInput>;
  onChange: (section: string, field: string, value: File[] | string | null, reset?: boolean) => void;
  validateAndSubmit: () => Promise<boolean | undefined>;
}

export default function ProofOfIdentityForm({ data, onChange, validateAndSubmit }: ProofOfIdentityFormProps) {
  const { nextStep } = useStepper();
  const [open, setOpen] = useState(false);
  const signaturePadRef = useRef<SignaturePad>(null);
  const [images, setImages] = useState<Record<ImageCategory, ImageFile[]>>({
    photoId: [],
    photoHoldingId: [],
  });

  const form = useForm<ProofOfIdentityInput>();

  useEffect(() => {
    // Load existing images in data to the state every time the component mounts
    (["photoId", "photoHoldingId"] as ImageCategory[]).forEach((category) => {
      if (data[category]) {
        setImages((prevImages) => ({
          ...prevImages,
          [category]: (data[category] as File[]).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          })),
        }));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignatureSave = () => {
    if (signaturePadRef.current) {
      // Check if signature pad is empty - more reliable method
      const isEmpty = signaturePadRef.current.isEmpty() || 
                      !signaturePadRef.current.toData() || 
                      signaturePadRef.current.toData().length === 0;
      
      if (isEmpty) {
        // Set form error
        form.setError("signature", {
          type: "manual",
          message: "Please sign before saving",
        });
        return;
      }
      
      const signatureData = signaturePadRef.current.toDataURL();
      form.setValue("signature", signatureData);
      form.clearErrors("signature");
      onChange("proofOfIdentity", "signature", signatureData);
    }
  };

  const handleSignatureClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      form.setValue("signature", "");
      onChange("proofOfIdentity", "signature", null);
    }
  };

  const handleFileUpload = (files: FileList | null, category: ImageCategory) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit

    if (validFiles.length !== fileArray.length) {
      alert("Some files exceed the 5MB size limit and were not included.");
    }

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(prev => {
      let updatedCategoryImages = [...prev[category], ...newImages];
      let updatedImages = {
        ...prev,
        [category]: updatedCategoryImages,
      };

      // Extract the updated files from the updated images state
      let updatedFiles = updatedCategoryImages.map(i => i.file);

      // Call onChange with the updated files
      onChange("proofOfIdentity", category, updatedFiles);

      return updatedImages;
    });
  };

  const removeImage = (category: ImageCategory, index: number) => {
    setImages(prev => {
      let updatedCategoryImages = prev[category].filter((_, i) => i !== index);
      let updatedImages = {
        ...prev,
        [category]: updatedCategoryImages,
      };
  
      // Extract the updated files from the updated images state
      let updatedFiles = updatedCategoryImages.map(i => i.file);
  
      // Call onChange with the updated files
      onChange("proofOfIdentity", category, updatedFiles);
  
      return updatedImages;
    });
  };

  const hasAnyImage = () => Object.values(images).some(categoryImages => categoryImages.length > 0);
  
  const onSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.clearErrors();

    const result = proofOfIdentitySchema.safeParse(data);
    
    if(result.success) {
      setOpen(true);
    } else {
      // Set errors based on zod validation result
      result.error.errors.forEach((error) => {
        return form.setError(error.path[0] as keyof ProofOfIdentityInput, {
          type: "manual",
          message: error.message,
        });
      });
    }
  };


  const renderImageGallery = (category: ImageCategory) => (
    <div className={`mt-2 grid grid-cols-2 gap-4 ${hasAnyImage() ? "h-24 sm:h-32 md:h-64": ""}`}>
      {images[category].map((image, index) => (
        <div key={index} className="group relative">
          <Image
            src={image.preview}
            alt={`Uploaded ${category} ${index + 1}`}
            className="h-32 w-full rounded-md border-2 border-dotted border-gray-800 object-cover"
            fill
          />
          <button
            onClick={() => removeImage(category, index)}
            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Remove ${category} ${index + 1}`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <Label className="mb-2 block">Please Provide Two(2) Valid ID&apos;s and Two(2) Photo of you holding the ID&apos;s.</Label>
            <p className="mb-4 text-sm text-muted-foreground">Max file size: 5MB, accepted: jpg|gif|png</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {(["photoId", "photoHoldingId"] as const).map((category) => (
                <FormField
                  key={category}
                  control={form.control}
                  name={category}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{category === "photoId" ? "Photo ID" : "Photo Holding ID"}</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".jpg,.gif,.png"
                          onChange={(e) => handleFileUpload(e.target.files, category)}
                          multiple
                        />
                      </FormControl>
                      {renderImageGallery(category)}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature <span className="text-sm text-muted-foreground">(Please save after completing)</span></FormLabel>
                  <FormControl>
                    <div className="rounded-md border border-gray-300 p-2">
                      <SignaturePad
                        ref={signaturePadRef}
                        options={{
                          minWidth: 1,
                          maxWidth: 2,
                          penColor: "black",
                          backgroundColor: "rgb(255, 255, 255)",
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {data.signature && (
              <div className="flex flex-col">
                <Label className='mb-[5px] mt-[5px]'>Saved Signature</Label>
                <div className="relative grow">
                  <Image src={data.signature} alt="Saved Signature" fill className="rounded-md border border-gray-300" />
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 space-x-2">
            <Button type="button" onClick={handleSignatureSave}>Save Signature</Button>
            <Button type="button" variant="outline" onClick={handleSignatureClear}>Clear</Button>
          </div>
          <StepperFormActions />
        </form>
      </Form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async ()=> {
              if(await validateAndSubmit()) nextStep();
            }}>Proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}