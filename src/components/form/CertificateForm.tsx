'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { DatePicker } from "../DatePicker"; // Ensure this is correctly imported

const FormSchema = z.object({
    precinct: z.string().min(1, 'Precinct is required'),
    firstname: z.string().min(1, 'Firstname is required'),
    middlename: z.string().min(1, 'Middlename is required'),
    lastname: z.string().min(1, 'Lastname is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    birthdate: z.string().min(1, 'Birthdate is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    contact: z.string().min(1, 'Contact is required').regex(/^\d+$/, 'Contact must be a valid number')
  });

const CertificateForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
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

      const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        console.log("Form values on submit:", values); // Add this line to log values
        try {
          const response = await fetch('/api/certificate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const result = await response.json();
      
          toast({
            title: "Success",
            description: "Certificate has been created successfully!",
            variant: "success"
          });
        } catch (error) {
          console.error('Error submitting form:', error); // Log detailed error message
          toast({
            title: "Error",
            description: error.message || "Oops! Something went wrong!",
            variant: "destructive"
          });
        }
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
