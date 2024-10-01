import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressInput, addressSchema } from '@/types/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepperFormActions } from './StepperFormActions';
import { useStepper } from '../ui/stepper'
import { scrollToForm } from './StepperFormActions'

export interface AddressFormProps {
  data: Partial<AddressInput>;
  onChange: (section: string, field: string, value: string, reset?: boolean) => void;
}


const AddressForm: React.FC<AddressFormProps> = ({ data, onChange }) => {
  const formName = 'address';
  const { nextStep } = useStepper();

  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      residency: undefined,
      yearsInMolinoIV: 0,
      blockLot: '',
      phase: '',
      street: '',
      subdivision: '',
      barangay: 'Molino IV',
      city: 'Bacoor',
      province: 'Cavite',
      ...data,
    },
  });

  function onSubmit(values: AddressInput) {
    nextStep();
    scrollToForm();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="residency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Residency*</FormLabel>
              <Select onValueChange={value => {onChange(formName, field.name, value); field.onChange(value)}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select residency type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HOME_OWNER">Home owner</SelectItem>
                  <SelectItem value="TENANT">Tenant</SelectItem>
                  <SelectItem value="HELPER">Helper</SelectItem>
                  <SelectItem value="CONSTRUCTION_WORKER">Construction Worker</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsInMolinoIV"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years in Molino IV</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="blockLot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Block/Lot</FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phase</FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subdivision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subdivision*</FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barangay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barangay*</FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City*</FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province*</FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} disabled />
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

export default AddressForm;