import * as React from "react"

import { cn } from "@/lib/utils"

const CardResult = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-bg",
      className
    )}
    {...props}
  />
))
CardResult.displayName = "Card"

const CardResultHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex bg-gray-200 text-x1 items-start items-center justify-between p-6", className)}
    {...props}
  />
))
CardResultHeader.displayName = "CardHeader"

const CardResultTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-[28px] font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardResultTitle.displayName = "CardTitle"

const CardResultDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(" bg-eucalyptus-dark flex items-center justify-center text-sm text-muted-foreground w-16 h-16 rounded-full text-white", className)}
    {...props}
  />
))
CardResultDescription.displayName = "CardDescription"

const CardResultContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardResultContent.displayName = "CardContent"

const CardResultFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardResultFooter.displayName = "CardFooter"

export { CardResult, CardResultHeader, CardResultFooter, CardResultTitle, CardResultDescription, CardResultContent }
