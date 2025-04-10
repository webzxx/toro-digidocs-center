import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStepper } from "@/components/ui/stepper";
import { scrollToForm, StepperFormActions } from "./StepperFormActions";
import { getCertificateTypeLabel, getDefaultValues } from "@/lib/utils/certificate";
import { CertificateInput, certificateSchema } from "@/types/types";
import { CertificateType } from "@prisma/client";
import { CertificateFormFields } from "./CertificateFormFields";

export interface CertificateFormProps {
  data: Partial<CertificateInput>
  onChange: (section: string, field: string, value: string, reset?: boolean) => void
}

const CertificateForm: React.FC<CertificateFormProps> = ({ data, onChange }) => {
  const formName = "certificate";
  const { nextStep } = useStepper();
    
  const form = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: getDefaultValues(data),
  });

  const certificateType = form.watch("certificateType");

  const onSubmit = async (values: CertificateInput) => {
    nextStep();
    scrollToForm();
  };

  const handleCertificateChange = (value: string) => {
    const fields = form.getValues();
    Object.keys(fields).forEach((key) => {
      if (key !== "certificateType") {
        form.setValue(key as keyof CertificateInput, "");
      }
    });
    onChange(formName, "certificateType", value, true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="certificateType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Type <span className="font-bold text-red-600">*</span></FormLabel>
              <Select onValueChange={value => { handleCertificateChange(value); field.onChange(value);}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(CertificateType).map(([key, value]) => (
                    <SelectItem key={key} value={value}>{getCertificateTypeLabel(key as keyof typeof CertificateType)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose <span className="font-bold text-red-600">*</span></FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <CertificateFormFields 
          certificateType={certificateType}
          form={form}
          onChange={onChange}
          formName={formName}
        />
        
        {["SOLO_PARENT", "COHABITATION", "GOOD_MORAL", "NO_INCOME", "RESIDENCY", "TRANSFER_OF_RESIDENCY", "LIVING_STILL", "BIRTH_FACT"].includes(certificateType) && (
          <FormField
            control={form.control}
            name="requestOf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request of <span className="font-bold text-red-600">*</span></FormLabel>
                <FormControl>
                  <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <StepperFormActions />
      </form>
    </Form>
  );
};

export default CertificateForm;