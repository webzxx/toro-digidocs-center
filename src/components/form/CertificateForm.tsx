'use client';

import { FieldName, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { z } from 'zod'; 
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { DatePicker } from "../DatePicker"; // Ensure this is correctly imported
import { personalInfoSchema, PersonalInfoInput } from "@/types/types";
import { createCertificate } from "@/app/api/certificate/actions";
import { House, Scroll, User, ScanFace } from "lucide-react"

import {
  Step,
  StepItem,
  Stepper,
  useStepper,
} from "@/components/ui/stepper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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

const FormActions = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
  } = useStepper()
  return (
    <div className="w-full flex justify-end gap-2">
      {hasCompletedAllSteps ? (
        <Button size="sm" onClick={resetSteps}>
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            variant="secondary"
          >
            Back
          </Button>
          <Button size="sm">
            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
          </Button>
        </>
      )}
    </div>
  )
}
 

function PersonalInfoForm(){
  const { nextStep } = useStepper();

  const form = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      precinctNumber: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: undefined,
      birthDate: '',
      email: '',
      contact: '',
      religion: undefined,
      status: undefined,
      sector: undefined,
      emergencyContactName: '',
      emergencyRelationship: '',
      emergencyContact: '',
      emergencyContactAddress: '',
    },
  });

  const onSubmit = async (values: PersonalInfoInput) => {
    console.log("Form values on submit:", values); // Add this line to log values
    nextStep()

  //   createCertificate(values).then((res)=>{
  //     if (res?.fieldError) {
  //         // fieldError: { email: "Invalid email "}
  //       Object.entries(res.fieldError).forEach(([field, message]) => {
  //         form.setError(field as FieldName<CertificateInput>, {
  //           type: "manual",
  //           message,
  //         });
  //       });
  //     }

  //     if (res?.serverError) {
  //       toast({
  //           title: "Error",
  //           description: res.serverError || "Oops! Something went wrong!",
  //           variant: "destructive"
  //         });
  //     }
      
  //     if (res?.success){
  //       toast({
  //         title: "Success",
  //         description: "Certificate has been created successfully!",
  //         variant: "default"
  //       });
  //     }
  //   })
  // };

  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="precinctNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precinct # (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender*</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Male" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Male
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Female" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Female
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="LGBTQ+" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      LGBTQ+
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date*</FormLabel>
              <FormControl>
                <div>
                  <DatePicker 
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="religion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Religion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Catholic">Catholic</SelectItem>
                  <SelectItem value="Iglesia ni Cristo">Iglesia ni Cristo</SelectItem>
                  <SelectItem value="Aglipay">Aglipay</SelectItem>
                  <SelectItem value="Baptist">Baptist</SelectItem>
                  <SelectItem value="Dating Daan">Dating Daan</SelectItem>
                  <SelectItem value="Islam">Islam</SelectItem>
                  <SelectItem value="Jehovah's Witnesses">Jehovah&apos;s Witnesses</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                  <SelectItem value="Legally Separated">Legally Separated</SelectItem>
                  <SelectItem value="LIVING-IN">LIVING-IN</SelectItem>
                  <SelectItem value="SEPARATED">SEPARATED</SelectItem>
                  <SelectItem value="DIVORCED">DIVORCED</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sector</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Solo Parent">Solo Parent</SelectItem>
                  <SelectItem value="PWD">PWD</SelectItem>
                  <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                  <SelectItem value="Indigent Indigenous People">Indigent Indigenous People</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emergencyContactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact Name*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emergencyRelationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Relationship*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emergencyContactAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact Address*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormActions/>
      </form>
    </Form>
  );
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
