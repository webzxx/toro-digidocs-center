'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { DatePicker } from "../DatePicker"; // Ensure this is correctly imported
import { CertificateSchema, CertificateInput } from "@/types/types";
import { createCertificate } from "@/app/api/certificate/actions";

type FormFieldKey =
  | "precinct"
  | "firstname"
  | "middlename"
  | "lastname"
  | "email"
  | "birthdate"
  | "contact"


const CertificateForm = () => {
    const form = useForm<CertificateInput>({
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

      const onSubmit = async (values: CertificateInput) => {
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
        // try {
        //   const response = await fetch('/api/certificate', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(values)
        //   });
      
        //   if (!response.ok) {
        //     throw new Error('Network response was not ok');
        //   }
      
        //   const result = await response.json();
      
        //   toast({
        //     title: "Success",
        //     description: "Certificate has been created successfully!",
        //     variant: "success"
        //   });
        // } catch (error) {
        //   console.error('Error submitting form:', error); // Log detailed error message
        //   toast({
        //     title: "Error",
        //     description: error.message || "Oops! Something went wrong!",
        //     variant: "destructive"
        //   });
        // }
      };
    
      

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="precinct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precinct</FormLabel>
                <FormControl>
                  <Input placeholder="Precinct#" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input placeholder="Firstname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middlename"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middlename</FormLabel>
                <FormControl>
                  <Input placeholder="Middlename" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input placeholder="Lastname" {...field} />
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
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <div>
                    <DatePicker 
                      selected={field.value ? new Date(field.value) : null}
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
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Contact number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default CertificateForm;
