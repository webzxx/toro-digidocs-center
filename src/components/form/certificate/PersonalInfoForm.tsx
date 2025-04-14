import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Input } from "../../ui/input";
import { DatePicker } from "../../DatePicker";

import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoInput } from "@/types/forms";

import {
  useStepper,
} from "@/components/ui/stepper";
import { scrollToForm, StepperFormActions } from "./StepperFormActions";
import { CivilStatus, Religion, Sector } from "@prisma/client";
import { formatReligion, formatSector, titleCase } from "@/lib/utils";

export interface PersonalInfoFormProps {
  data: Partial<PersonalInfoInput>;
  onChange: (section: string, field: string, value: string, reset?: boolean) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const formName = "personalInfo";
  const { nextStep } = useStepper();

  const form = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
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
      ...data,
    },
  });

  const onSubmit = async (values: PersonalInfoInput) => {
    nextStep();
    scrollToForm();
  };
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
              <FormLabel>First Name <span className="font-bold text-red-600">*</span></FormLabel>
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
              <FormLabel>Last Name <span className="font-bold text-red-600">*</span></FormLabel>
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
              <FormLabel>Gender <span className="font-bold text-red-600">*</span></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={value => {onChange(formName, field.name, value); field.onChange(value);}}
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
              <FormLabel>Birth Date <span className="font-bold text-red-600">*</span></FormLabel>
              <FormControl>
                <div>
                  <DatePicker
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => {onChange(formName, field.name, date ? date.toISOString().split("T")[0] : ""); field.onChange(date ? date.toISOString().split("T")[0] : "");}}
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
              <FormLabel>Contact <span className="font-bold text-red-600">*</span></FormLabel>
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
              <Select onValueChange={value => { onChange(formName, field.name, value); field.onChange(value);}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Religion).map((key) => (
                    <SelectItem key={key} value={key}>
                      {formatReligion(key)}
                    </SelectItem>
                  ))}
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
              <FormLabel>Status <span className="font-bold text-red-600">*</span></FormLabel>
              <Select onValueChange={value => { onChange(formName, field.name, value); field.onChange(value);}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CivilStatus).map((key) => (
                    <SelectItem key={key} value={key}>
                      {titleCase(key.replace(/_/g, " "))}
                    </SelectItem>
                  ))}
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
              <Select onValueChange={value => {onChange(formName, field.name, value); field.onChange(value);}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Sector).map((key) => (
                    <SelectItem key={key} value={key}>
                      {formatSector(key)}
                    </SelectItem>
                  ))}
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
              <FormLabel>Emergency Contact Name <span className="font-bold text-red-600">*</span></FormLabel>
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
              <FormLabel>Emergency Relationship <span className="font-bold text-red-600">*</span></FormLabel>
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
              <FormLabel>Emergency Contact <span className="font-bold text-red-600">*</span></FormLabel>
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
              <FormLabel>Emergency Contact Address <span className="font-bold text-red-600">*</span></FormLabel>
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
};

export default PersonalInfoForm;