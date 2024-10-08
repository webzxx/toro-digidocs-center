'use client';

import { Button } from "../ui/button";
import { House, Scroll, User, ScanFace, CheckCircle2, Signature } from "lucide-react"

import {
  Step,
  StepItem,
  Stepper,
  useStepper,
} from "@/components/ui/stepper"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import PersonalInfoForm from "./PersonalInfoForm";
import AddressForm from "./AddressForm";
import { useState } from "react";
import ImportantInfoForm from "./ImportantInfoForm";
import ProofOfIdentityForm from "./ProofOfIdentityForm";
import { completeCertificateFormSchema } from "@/types/types";
import { scrollToForm } from "./StepperFormActions";
import { createCertificateRequest } from "@/app/api/certificate/actions";
import { useToast } from "../ui/use-toast";

const steps = [
  { label: "Step 1", description: "Personal Info", icon: User },
  { label: "Step 2", description: "Address", icon: House },
  { label: "Step 3", description: "Important Information", icon: Scroll },
  { label: "Step 4", description: "Proof of Identity", icon: ScanFace },
] satisfies StepItem[]

const initialFormData = {
  personalInfo: {
    precinctNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: undefined,
    birthDate: "",
    email: "",
    contact: "",
    religion: undefined,
    status: undefined,
    sector: undefined,
    emergencyContactName: "",
    emergencyRelationship: "",
    emergencyContact: "",
    emergencyContactAddress: "",
  },
  address: {
    residency: undefined,
    yearsInBahayToro: 0,
    blockLot: "",
    phase: "",
    street: "",
    subdivision: "",
    barangay: "Bahay Toro" as const,
    city: "Quezon City" as const,
    province: "Metro Manila" as const,
  },
  importantInfo: {
    certificateType: undefined,
    purpose: "",
  },
  proofOfIdentity: {
    photoId: undefined,
    photoHoldingId: undefined,
    signature: undefined,
  },
}

export default function CertificateForm() {
  const { resetSteps } = useStepper()
  const { toast } = useToast()
  const [formData, setFormData] = useState(initialFormData);
  const [requestDetails, setRequestDetails] = useState({ referenceNumber: "", systemId: "" });

  const validateAndSubmit : () => Promise<boolean> = async () => {
    const result = completeCertificateFormSchema.safeParse(formData);
    if (result.success) {
      const files = new FormData();
      const photoIdArray = result.data.proofOfIdentity.photoId as File[];
      photoIdArray.forEach((file, index) => {
        files.append(`photoId[${index}]`, file);
      });
      const photoHoldingIdArray = result.data.proofOfIdentity.photoHoldingId as File[];
      photoHoldingIdArray.forEach((file, index) => {
        files.append(`photoHoldingId[${index}]`, file);
      });
      files.append("signature", result.data.proofOfIdentity.signature as string);

      const data = {
        personalInfo: result.data.personalInfo,
        address: result.data.address,
        importantInfo: result.data.importantInfo,
        proofOfIdentity: {
          signature: result.data.proofOfIdentity.signature,
        }
      }      

      let success = true;
      try {
        const res = await createCertificateRequest(data, files);
        if (res?.fieldErrors) {
          toast({
            title: "Error",
            description: "Certificate form is invalid.",
            variant: "destructive"
          });
          success = false;
        }
        if (res?.serverError) {
          toast({
            title: "Error",
            description: res.serverError || "Oops! Something went wrong!",
            variant: "destructive"
          });
          success = false;
        }
        
        if (res?.success) {
          toast({
            title: "Success",
            description: "Certificate has been created successfully!",
            variant: "default"
          });

          setRequestDetails({
            referenceNumber: res?.data.referenceNumber || "ERROR",
            systemId: res?.data.bahayToroSystemId || "ERROR"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
        success = false;
      }
      return success;
    } else {
      console.error("Invalid form data", result.error.errors);
      toast({
        title: "Error",
        description: "Certificate form is invalid.",
        variant: "destructive"
      });
      return false;
    }
  }

  const resetFormData = () => { 
    console.log("Resetting form data");
    setFormData(initialFormData);
    
  }

  const handleChange = (section: string, field: string, value: string | File[] | null, reset: boolean = false) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: reset
        ? { [field]: value }
        : {
            ...prevData[section as keyof typeof prevData],
            [field]: value,
          },
    }));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps} variant="circle-alt">
        {steps.map((stepProps, index) => {
          if(index === 0) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <PersonalInfoForm
                  data={formData.personalInfo}
                  onChange={handleChange}
                />
              </Step>
            )
          }
          else if(index === 1) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <AddressForm 
                  data={formData.address}
                  onChange={handleChange}
                />
              </Step>
            )
          }
          else if(index === 2) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <ImportantInfoForm 
                  data={formData.importantInfo}
                  onChange={handleChange}
                />
              </Step>
            )
          }
          return (
            <Step key={stepProps.label} {...stepProps}>
              <ProofOfIdentityForm
                data={formData.proofOfIdentity}
                onChange={handleChange}
                validateAndSubmit={validateAndSubmit}
              />
            </Step>
          )
        })}
        <Footer details={requestDetails} resetFormData={resetFormData} />
      </Stepper>
    </div>
  )
}

type FooterProps = {
  details: {
    referenceNumber: string;
    systemId: string;
  };
  resetFormData: () => void;
};

function Footer({ details, resetFormData }: FooterProps) {
  const { activeStep, steps, resetSteps } = useStepper()

  if (activeStep !== steps.length) {
    return null
  }

  const resetMultiForm = () => {
    resetFormData();
    resetSteps();
    scrollToForm();
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 text-center">
        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-green-600 mb-6">
          Congrats, your request was successfully sent!
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500">REFERENCE NUMBER</p>
            <p className="text-lg font-bold">{details.referenceNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">BAHAY TORO SYSTEM ID</p>
            <p className="text-lg font-bold">{details.systemId}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          We will get in touch with you using the details you have provided. Thank you.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" onClick={resetMultiForm}>
          REQUEST ANOTHER CERTIFICATE
        </Button>
      </CardFooter>
    </Card>
  )
}
