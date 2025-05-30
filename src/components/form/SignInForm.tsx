"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SignInFormValues, signInFormSchema } from "@/types/auth";

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: SignInFormValues) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    
    if(signInData?.error) {
      toast({
        title: "Error",
        description: "Oops! Something went wrong!",
        variant: "destructive",
      });
    } else {
      router.refresh(); // Refresh the router to update server components
      if(signInData?.ok) {
        // Add a small delay to ensure session is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get the updated session to check user role
        // const session = await getSession();
        // const userRole = session?.user?.role;
        // Determine destination based on user role
        // const destination = userRole === 'ADMIN' ? '/dashboard' : '/';
        
        const destination = "/dashboard";
        router.push(destination);
      }
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="enter your password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-6 w-full" type="submit">Sign in</Button>
      </form>
      <p className="mt-2 text-center text-sm text-gray-600">
        If you don&apos;t have an account, please &nbsp;
        <Link className="text-blue-500 hover:underline" href='/sign-up'>Sign up</Link>
      </p>
    </Form>
  );
};

export default SignInForm;
