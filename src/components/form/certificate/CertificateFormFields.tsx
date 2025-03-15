import { CertificateType } from '@prisma/client'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { DatePicker } from '@/components/DatePicker'
import { CertificateInput } from '@/types/types'
import { UseFormReturn } from 'react-hook-form'

interface CertificateFormFieldsProps {
  certificateType: CertificateType | string
  form: UseFormReturn<CertificateInput>
  onChange?: (section: string, field: string, value: string, reset?: boolean) => void
  formName?: string
}

export const CertificateFormFields = ({ 
  certificateType, 
  form, 
  onChange,
  formName = 'certificate'
}: CertificateFormFieldsProps) => {
  
  // Helper function to handle date changes that works for both components
  const handleDateChange = (field: any, fieldName: string, date: Date | null) => {
    const dateString = date ? date.toISOString().split('T')[0] : '';
    field.onChange(dateString);
    
    // Only call onChange if it's provided (from CertificateForm)
    if (onChange) {
      onChange(formName, fieldName, dateString);
    }
  };
  
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                      onChange={(date) => handleDateChange(field, field.name, date)}
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                      onChange={(date) => handleDateChange(field, field.name, date)}
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
                    onChange={(date) => handleDateChange(field, field.name, date)}
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
                    onChange={(date) => handleDateChange(field, field.name, date)}
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                      onChange={(date) => handleDateChange(field, field.name, date)}
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
                <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                    onChange={(date) => handleDateChange(field, field.name, date)}
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
                      onChange={(date) => handleDateChange(field, field.name, date)}
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
                  <Input {...field} onChangeCapture={onChange ? e => onChange(formName, e.currentTarget.name, e.currentTarget.value) : undefined} />
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
