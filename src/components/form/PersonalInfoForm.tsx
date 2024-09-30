import { FieldName, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { DatePicker } from "../DatePicker";

import { z } from 'zod'; 
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoInput } from "@/types/types";
import { createCertificate } from "@/app/api/certificate/actions";

import {
  useStepper,
} from "@/components/ui/stepper"
import { scrollToForm, StepperFormActions } from "./StepperFormActions";

export interface PersonalInfoFormProps {
  data: Partial<PersonalInfoInput>;
  onChange: (section: string, field: string, value: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const formName = 'personalInfo';
  const { nextStep } = useStepper();

  const form = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      precinctNumber: data.precinctNumber || '',
      firstName: data.firstName || '',
      middleName: data.middleName || '',
      lastName: data.lastName || '',
      gender: data.gender || undefined,
      birthDate: data.birthDate || '',
      email: data.email || '',
      contact: data.contact || '',
      religion: data.religion || undefined,
      status: data.status || undefined,
      sector: data.sector || undefined,
      emergencyContactName: data.emergencyContactName || '',
      emergencyRelationship: data.emergencyRelationship || '',
      emergencyContact: data.emergencyContact || '',
      emergencyContactAddress: data.emergencyContactAddress || '',
    },
  });

  const onSubmit = async (values: PersonalInfoInput) => {
    console.log("Form values on submit:", values); // Add this line to log values
    nextStep()
    scrollToForm()

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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
                  onValueChange={value => {onChange(formName, field.name, value); field.onChange(value)}}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MALE" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Male
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FEMALE" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Female
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="LGBTQ" />
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
                    onChange={(date) => {onChange(formName, field.name, date ? date.toISOString().split('T')[0] : ''); field.onChange(date ? date.toISOString().split('T')[0] : '')}}
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
                <Input type="email" {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
              <Select onValueChange={value => { onChange(formName, field.name, value); field.onChange(value)}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CATHOLIC">Catholic</SelectItem>
                  <SelectItem value="IGLESIA_NI_CRISTO">Iglesia ni Cristo</SelectItem>
                  <SelectItem value="AGLIPAY">Aglipay</SelectItem>
                  <SelectItem value="BAPTIST">Baptist</SelectItem>
                  <SelectItem value="DATING_DAAN">Dating Daan</SelectItem>
                  <SelectItem value="ISLAM">Islam</SelectItem>
                  <SelectItem value="JEHOVAHS_WITNESSES">Jehovah&apos;s Witnesses</SelectItem>
                  <SelectItem value="OTHERS">Others</SelectItem>
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
              <Select onValueChange={value => { onChange(formName, field.name, value); field.onChange(value)}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="WIDOW">Widow</SelectItem>
                  <SelectItem value="LEGALLY_SEPARATED">Legally Separated</SelectItem>
                  <SelectItem value="LIVING_IN">LIVING-IN</SelectItem>
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
              <Select onValueChange={value => {onChange(formName, field.name, value); field.onChange(value)}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SOLO_PARENT">Solo Parent</SelectItem>
                  <SelectItem value="PWD">PWD</SelectItem>
                  <SelectItem value="SENIOR_CITIZEN">Senior Citizen</SelectItem>
                  <SelectItem value="INDIGENT_INDIGENOUS_PEOPLE">Indigent Indigenous People</SelectItem>
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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
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
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}

export default PersonalInfoForm;