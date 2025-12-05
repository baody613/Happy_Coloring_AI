import React from 'react';
import { Input, InputProps } from './ui/Input';
import { cn } from '@/utils/helpers';

export interface FormFieldProps extends Omit<InputProps, 'label'> {
  label?: string;
  description?: string;
  required?: boolean;
  horizontal?: boolean;
}

export function FormField({
  label,
  description,
  required,
  horizontal = false,
  className,
  ...inputProps
}: FormFieldProps) {
  if (horizontal) {
    return (
      <div className="grid grid-cols-3 gap-4 items-start">
        {label && (
          <div className="col-span-1 pt-2">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        )}
        <div className="col-span-2">
          <Input {...inputProps} className={className} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <Input {...inputProps} className={className} />
    </div>
  );
}

// Textarea variant
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export function Textarea({
  label,
  error,
  description,
  required,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <textarea
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Select variant
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  description,
  required,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <select
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
