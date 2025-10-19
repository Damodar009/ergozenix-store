import * as React from "react"
import NextLink from "next/link"
import { cn } from "@/lib/utils"

export interface LinkProps extends React.ComponentProps<typeof NextLink> {
  underline?: boolean
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, underline = false, ...props }, ref) => {
    return (
      <NextLink
        ref={ref}
        className={cn(
          "text-sm font-medium text-foreground/80 hover:text-foreground",
          underline && "underline underline-offset-4",
          className,
        )}
        {...props}
      />
    )
  },
)

Link.displayName = "Link"


