import { useForm, UseFormProps, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

/**
 * Custom hook for form validation with react-hook-form and Zod
 * 
 * @example
 * const { register, handleSubmit, errors } = useValidatedForm(loginSchema);
 * 
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   <input {...register('email')} />
 *   {errors.email && <span>{errors.email.message}</span>}
 * </form>
 */
export function useValidatedForm<T extends FieldValues>(
  schema: ZodSchema,
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options,
  });
}

/**
 * Helper to get field error message
 */
export function getErrorMessage(error: any): string {
  return error?.message || 'Invalid input';
}

/**
 * Helper to check if field has error
 */
export function hasError(errors: any, fieldName: string): boolean {
  return !!errors[fieldName];
}
