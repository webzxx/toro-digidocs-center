'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { DatePicker } from "../DatePicker"; // Ensure this is correctly imported
import { CertificateSchema, CertificateInput } from "@/types/types";
import { createCertificate } from "@/app/api/certificate/actions";
import { House, Scroll, User, ScanFace } from "lucide-react"

import {
  Step,
  StepItem,
  Stepper,
  useStepper,
} from "@/components/ui/stepper"

type FormFieldKey =
  | "precinct"
  | "firstname"
  | "middlename"
  | "lastname"
  | "email"
  | "birthdate"
  | "contact"

const steps = [
  { label: "Step 1", description: "Personal Info", icon: User },
  { label: "Step 2", description: "Address", icon: House },
  { label: "Step 3", description: "Important Information", icon: Scroll },
  { label: "Step 4", description: "Proof of Identity", icon: ScanFace },
] satisfies StepItem[]


function StepperDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps} >
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
                <h1 className="text-xl">Step {index + 1}</h1>
              </div>
            </Step>
          )
        })}
        <Footer />
      </Stepper>
    </div>
  )
}

const Footer = () => {
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
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">All steps completed! 🎉</h1>
        </div>
      )}
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
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  )
}
 

const CertificateForm = () => {
  const form = useForm<typeof CertificateInput>({
    resolver: zodResolver(CertificateSchema),
    defaultValues: {
      precinct: '',
      firstname: '',
      middlename: '',
      lastname: '',
      email: '',
      birthdate: '',
      contact: ''
    },
  });

  const onSubmit = async (values: typeof CertificateInput) => {
    console.log("Form values on submit:", values); // Add this line to log values

    createCertificate(values).then((res)=>{
      if (res?.fieldError) {
          // fieldError: { email: "Invalid email "}
        Object.entries(res.fieldError).forEach(([field, message]) => {
          form.setError(field as FormFieldKey, {
            type: "manual",
            message,
          });
        });
      }

      if (res?.serverError) {
        toast({
            title: "Error",
            description: res.serverError || "Oops! Something went wrong!",
            variant: "destructive"
          });
      }
      
      if (res?.success){
        toast({
          title: "Success",
          description: "Certificate has been created successfully!",
          variant: "default"
        });
      }
    })
  };
    
      
  return StepperDemo()
  // return (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(onSubmit)}>
  //       <div className="space-y-4">
  //         <FormField
  //           control={form.control}
  //           name="precinct"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Precinct</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="Precinct#" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="firstname"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Firstname</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="Firstname" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="middlename"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Middlename</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="Middlename" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="lastname"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Lastname</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="Lastname" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="email"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Email</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="Enter your email" type="email" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="birthdate"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Date of Birth</FormLabel>
  //               <FormControl>
  //                 <div>
  //                   <DatePicker 
  //                     selected={field.value ? new Date(field.value) : null}
  //                     onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
  //                   />
  //                 </div>
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="contact"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Contact</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="Contact number" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //       </div>
  //       <Button className="w-full mt-6" type="submit">Submit</Button>
  //     </form>
  //   </Form>
  // )
}

export default CertificateForm;
