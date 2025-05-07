import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    limit?: number
    }

    export function AvatarGroup({ className, limit = 3, children, ...props }: AvatarGroupProps) {
    const childrenArray = React.Children.toArray(children)
    const limitedChildren = limit ? childrenArray.slice(0, limit) : childrenArray
    const excess = childrenArray.length - limitedChildren.length

    return (
        <div className={cn("flex -space-x-2 overflow-hidden", className)} {...props}>
        {limitedChildren}
        {excess > 0 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
            +{excess}
            </div>
        )}
        </div>
    )
}
