"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import cn from "../../cn"

const Toggle = React.forwardRef<
    React.ComponentRef<typeof TogglePrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
    <TogglePrimitive.Root
        ref={ref}
        className={cn(
            "inline-flex items-center fill-white justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-300 p-1 h-full",
            "hover:bg-zinc-800 hover:text-cmd-bg", // muted hover
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white", // blue ring
            "disabled:pointer-events-none disabled:opacity-50",
            "data-[state=on]:bg-zinc-800 data-[state=on]:text-[#fff]", // accent active
            "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            className
        )}
        {...props}
    />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export default Toggle
