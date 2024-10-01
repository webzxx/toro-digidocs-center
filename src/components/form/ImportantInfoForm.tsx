import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ImportantInfoInput, importantInfoSchema } from '@/types/types'
import { useStepper } from '../ui/stepper'
import { scrollToForm, StepperFormActions } from './StepperFormActions'
import { DatePicker } from '../DatePicker'

export interface ImportantInfoFormProps {
  data: Partial<ImportantInfoInput>
  onChange: (section: string, field: string, value: string, reset?: boolean) => void
}

const ImportantInfoForm: React.FC<ImportantInfoFormProps> = ({ data, onChange }) => {
  const formName = 'importantInfo'
  const { nextStep } = useStepper()

  const getDefaultValues = (): Partial<ImportantInfoInput> => {
    const baseValues = {
      certificateType: data.certificateType || undefined,
      purpose: data.purpose || "",
    };

    switch (data.certificateType) {
      case "SOLO_PARENT":
        return {
          ...baseValues,
          certificateType: "SOLO_PARENT",
          childName: data.childName || "",
          soloParentSince: data.soloParentSince || "",
          presentedBy: data.presentedBy || "",
          registryNo: data.registryNo || "",
          requestOf: data.requestOf || "",
        };
      case "GOOD_MORAL":
        return {
          ...baseValues,
          certificateType: "GOOD_MORAL",
          requestOf: data.requestOf || "",
        };
      case "COHABITATION":
        return {
          ...baseValues,
          certificateType: "COHABITATION",
          birthAddress: data.birthAddress || "",
          spouseName: data.spouseName || "",
          spouseBirthAddress: data.spouseBirthAddress || "",
          dateOfMarriage: data.dateOfMarriage || "",
          requestOf: data.requestOf || "",
        };
      case "NO_INCOME":
        return {
          ...baseValues,
          certificateType: "NO_INCOME",
          noIncomeSince: data.noIncomeSince || "",
          requestOf: data.requestOf || "",
        };
      case "FIRST_TIME_JOB_SEEKER":
        return {
          ...baseValues,
          certificateType: "FIRST_TIME_JOB_SEEKER",
          dateOfResidency: data.dateOfResidency || "",
        };
      case "RESIDENCY":
        return {
          ...baseValues,
          certificateType: "RESIDENCY",
          birthAddress: data.birthAddress || "",
          dateOfResidency: data.dateOfResidency || "",
          requestOf: data.requestOf || "",
        };
      case "TRANSFER_OF_RESIDENCY":
        return {
          ...baseValues,
          certificateType: "TRANSFER_OF_RESIDENCY",
          newAddress: data.newAddress || "",
        };
      case "LIVING_STILL":
        return {
          ...baseValues,
          certificateType: "LIVING_STILL",
          dateOfTabloid: data.dateOfTabloid || "",
        };
      case "BIRTH_FACT":
        return {
          ...baseValues,
          certificateType: "BIRTH_FACT",
          dateBorn: data.dateBorn || "",
          childName: data.childName || "",
          birthAddress: data.birthAddress || "",
          witnessName: data.witnessName || "",
          witnessType: data.witnessType || "",
        };
      default:
        return baseValues;
    }
  };
    
  const form = useForm<ImportantInfoInput>({
    resolver: zodResolver(importantInfoSchema),
    defaultValues: getDefaultValues(),
  })

  const certificateType = form.watch('certificateType')

  const onSubmit = async (values: ImportantInfoInput) => {
    console.log(values)
    nextStep()
    scrollToForm()
  }

  const renderAdditionalFields = () => {
    switch (certificateType) {
      case 'SOLO_PARENT':
        return (
          <>
            <FormField
              control={form.control}
              name="childName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Child Name*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soloParentSince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solo Parent Since*</FormLabel>
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
              name="presentedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presented by*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registryNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registry No*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case 'COHABITATION':
        return (
          <>
            <FormField
              control={form.control}
              name="birthAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Address*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spouseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spouse Name*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spouseBirthAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spouse Birth Address*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfMarriage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Marriage*</FormLabel>
                  <FormControl>
                    <div>
                      <DatePicker
                        allowFutureDates
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => {onChange(formName, field.name, date ? date.toISOString().split('T')[0] : ''); field.onChange(date ? date.toISOString().split('T')[0] : '')}}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case 'NO_INCOME':
        return (
          <FormField
            control={form.control}
            name="noIncomeSince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No Income Since*</FormLabel>
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
        )
      case 'FIRST_TIME_JOB_SEEKER':
        return (
          <FormField
            control={form.control}
            name="dateOfResidency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Residency*</FormLabel>
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
        )
      case 'RESIDENCY':
        return (
          <>
            <FormField
              control={form.control}
              name="birthAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Address*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfResidency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Residency*</FormLabel>
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
          </>
        )
      case 'TRANSFER_OF_RESIDENCY':
        return (
          <FormField
            control={form.control}
            name="newAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Address*</FormLabel>
                <FormControl>
                  <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case 'LIVING_STILL':
        return (
          <FormField
            control={form.control}
            name="dateOfTabloid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Tabloid*</FormLabel>
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
        )
      case 'BIRTH_FACT':
        return (
          <>
            <FormField
              control={form.control}
              name="dateBorn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Born*</FormLabel>
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
              name="childName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Child Name*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Address*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="witnessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Witness Name*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="witnessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Witness Type*</FormLabel>
                  <FormControl>
                    <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      default:
        return null
    }
  }

  const handleCertificateChange = (value: string) => {
    const fields = form.getValues()
    Object.keys(fields).forEach((key) => {
      if (key !== 'certificateType') {
        form.setValue(key as keyof ImportantInfoInput, '');
      }
    });
    onChange(formName, 'certificateType', value, true);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="certificateType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Type*</FormLabel>
              <Select onValueChange={value => { handleCertificateChange(value); field.onChange(value)}} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BARANGAY_CLEARANCE">Barangay Clearance</SelectItem>
                  <SelectItem value="BARANGAY_ID">Barangay ID</SelectItem>
                  <SelectItem value="SOLO_PARENT">Solo Parent</SelectItem>
                  <SelectItem value="COHABITATION">Cohabitation</SelectItem>
                  <SelectItem value="GOOD_MORAL">Good Moral</SelectItem>
                  <SelectItem value="NO_INCOME">No Income</SelectItem>
                  <SelectItem value="FIRST_TIME_JOB_SEEKER">First Time Job Seeker</SelectItem>
                  <SelectItem value="RESIDENCY">Residency</SelectItem>
                  <SelectItem value="TRANSFER_OF_RESIDENCY">Transfer of Residency</SelectItem>
                  <SelectItem value="LIVING_STILL">Living Still</SelectItem>
                  <SelectItem value="BIRTH_FACT">Birth Fact</SelectItem>
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
              <FormLabel>Purpose*</FormLabel>
              <FormControl>
                <Input {...field} onChangeCapture={e => onChange(formName, e.currentTarget.name, e.currentTarget.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {renderAdditionalFields()}
        {['SOLO_PARENT', 'COHABITATION', 'GOOD_MORAL', 'NO_INCOME', 'RESIDENCY', 'TRANSFER_OF_RESIDENCY', 'LIVING_STILL', 'BIRTH_FACT'].includes(certificateType) && (
          <FormField
            control={form.control}
            name="requestOf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request of*</FormLabel>
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
  )
}

export default ImportantInfoForm