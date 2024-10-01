'use client';

import { Button } from "../ui/button";
import { House, Scroll, User, ScanFace, CheckCircle2 } from "lucide-react"

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
import { completeFormSchema } from "@/types/types";

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
    yearsInMolinoIV: 0,
    blockLot: "",
    phase: "",
    street: "",
    subdivision: "",
    // Uncomment the following lines to set default values if needed
    // barangay: "Molino IV",
    // city: "Bacoor",
    // province: "Cavite",
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
  const [formData, setFormData] = useState(initialFormData);

  const validateAndSubmit = () => {
    const result = completeFormSchema.safeParse(formData);
    if (result.success) {
      console.log("Valid form data", result.data);
    } else {
      console.error("Invalid form data", result.error.errors);
    }
  }

  const reset = () => { 
    setFormData(initialFormData);
    resetSteps();
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
        <Footer details={{ referenceNumber: "JPC-00227", systemId: "MOLINO-IV-10447" }} resetMultiForm={reset} />
      </Stepper>
    </div>
  )
}

type FooterProps = {
  details: {
    referenceNumber: string;
    systemId: string;
  };
  resetMultiForm: () => void;
};

function Footer({ details, resetMultiForm }: FooterProps) {
  const { activeStep, resetSteps, steps } = useStepper()

  if (activeStep !== steps.length) {
    return null
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
            <p className="text-sm font-medium text-gray-500">MOLINO SYSTEM ID</p>
            <p className="text-lg font-bold">{details.systemId}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          We will get in touch with you using the details you have provided. Thank you
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
