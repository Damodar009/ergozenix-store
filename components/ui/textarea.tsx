import * as React from 'react'

import { cn } from '@/lib/utils'

import { cva, type VariantProps } from 'class-variance-authority'

const textareaVariants = cva(
  'flex field-sizing-content w-full bg-transparent text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-muted-foreground',
  {
    variants: {
      variant: {
        default:
          'min-h-16 rounded-md border border-input px-3 py-2 shadow-xs dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        underline:
          'min-h-[100px] border-b border-border rounded-none px-0 py-2 focus-visible:border-primary focus-visible:ring-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface TextareaProps
  extends React.ComponentProps<'textarea'>,
    VariantProps<typeof textareaVariants> {}

function Textarea({ className, variant, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Textarea }
