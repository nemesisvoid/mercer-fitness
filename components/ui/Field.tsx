'use client';

import * as React from 'react';
import type { FieldError } from 'react-hook-form';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Field (wrapper — sets data-invalid for styling)
// ---------------------------------------------------------------------------

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  'data-invalid'?: boolean;
};

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid gap-2', className)}
      {...props}
    />
  ),
);
Field.displayName = 'Field';

// ---------------------------------------------------------------------------
// FieldLabel
// ---------------------------------------------------------------------------

type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('font-heading text-sm font-semibold text-slate-700', className)}
      {...props}
    />
  ),
);
FieldLabel.displayName = 'FieldLabel';

// ---------------------------------------------------------------------------
// FieldDescription
// ---------------------------------------------------------------------------

type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs leading-5 text-slate-500', className)}
      {...props}
    />
  ),
);
FieldDescription.displayName = 'FieldDescription';

// ---------------------------------------------------------------------------
// FieldError
// ---------------------------------------------------------------------------

type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement> & {
  errors?: (FieldError | undefined)[];
};

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, errors, ...props }, ref) => {
    const message = errors?.find(Boolean)?.message;
    if (!message) return null;
    return (
      <p
        ref={ref}
        role='alert'
        className={cn('text-xs font-medium text-red-500', className)}
        {...props}
      >
        {message}
      </p>
    );
  },
);
FieldError.displayName = 'FieldError';

// ---------------------------------------------------------------------------
// Shared input / select / textarea class
// ---------------------------------------------------------------------------

const fieldInputClass =
  'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 aria-[invalid=true]:border-red-300 aria-[invalid=true]:focus:border-red-400 aria-[invalid=true]:focus:ring-red-100';

export { Field, FieldDescription, FieldError, FieldLabel, fieldInputClass };
