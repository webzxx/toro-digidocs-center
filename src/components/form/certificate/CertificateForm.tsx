import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStepper } from '@/components/ui/stepper'
import { DatePicker } from '@/components/DatePicker'
import { scrollToForm, StepperFormActions } from './StepperFormActions'
import { getCertificateTypeLabel, getDefaultValues } from '@/lib/certificate-utils'
import { CertificateInput, certificateSchema } from '@/types/types'
import { CertificateType } from '@prisma/client'

export interface CertificateFormProps {
  data: Partial<CertificateInput>
  onChange: (section: string, field: string, value: string, reset?: boolean) => void
}

const CertificateForm: React.FC<CertificateFormProps> = ({ data, onChange }) => {
  const formName = 'certificate'
  const { nextStep } = useStepper()
    
  const form = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: getDefaultValues(data),
  })

  const certificateType = form.watch('certificateType')

  const onSubmit = async (values: CertificateInput) => {
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
                  <FormLabel>Child Name <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Solo Parent Since <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Presented by <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Registry No <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Birth Address <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Spouse Name <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Spouse Birth Address <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Date of Marriage <span className="text-red-600 font-bold">*</span></FormLabel>
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
                <FormLabel>No Income Since <span className="text-red-600 font-bold">*</span></FormLabel>
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
                <FormLabel>Date of Residency <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Birth Address <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Date of Residency <span className="text-red-600 font-bold">*</span></FormLabel>
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
                <FormLabel>New Address <span className="text-red-600 font-bold">*</span></FormLabel>
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
                <FormLabel>Date of Tabloid <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Date Born <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Child Name <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Birth Address <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Witness Name <span className="text-red-600 font-bold">*</span></FormLabel>
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
                  <FormLabel>Witness Type <span className="text-red-600 font-bold">*</span></FormLabel>
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
        form.setValue(key as keyof CertificateInput, '');
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
              <FormLabel>Certificate Type <span className="text-red-600 font-bold">*</span></FormLabel>
              <Select onValueChange={value => { handleCertificateChange(value); field.onChange(value)}} defaultValue={field.value}>
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
              <FormLabel>Purpose <span className="text-red-600 font-bold">*</span></FormLabel>
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
                <FormLabel>Request of <span className="text-red-600 font-bold">*</span></FormLabel>
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

export default CertificateForm