'use client';

import { Button } from "../ui/button";
import { House, Scroll, User, ScanFace } from "lucide-react"

import {
  Step,
  StepItem,
  Stepper,
  useStepper,
} from "@/components/ui/stepper"
import PersonalInfoForm from "./PersonalInfoForm";

const steps = [
  { label: "Step 1", description: "Personal Info", icon: User },
  { label: "Step 2", description: "Address", icon: House },
  { label: "Step 3", description: "Important Information", icon: Scroll },
  { label: "Step 4", description: "Proof of Identity", icon: ScanFace },
] satisfies StepItem[]


export default function CertificateForm() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps} variant="circle-alt">
        {steps.map((stepProps, index) => {
          if(index === 0) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <PersonalInfoForm />
              </Step>
            )
          }
          else if(index === 1) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <AddressForm />
              </Step>
            )
          }
          else if(index === 2) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <ImportantInfoForm />
              </Step>
            )
          }
          return (
            <Step key={stepProps.label} {...stepProps}>
              <ProofOfIdentityForm />
            </Step>
          )
        })}
        <Footer />
      </Stepper>
    </div>
  )
}

function AddressForm() {
  return (
    <>
    </>
  )
}

function ImportantInfoForm() {
  return (
    <>
    </>
  )
}

function ProofOfIdentityForm() {
  return (
    <>  
    </>
  )
}

function Footer() {
  const { activeStep, resetSteps, steps } = useStepper()

  if (activeStep !== steps.length) {
    return null
  }

  return (
    <>
      {/* <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
        <h1 className="text-xl">All steps completed! 🎉</h1>
      </div> */}
    <div className="flex items-center justify-end gap-2">
      <Button onClick={resetSteps}>Reset Stepper with Form</Button>
    </div>
    </>
  )
}
