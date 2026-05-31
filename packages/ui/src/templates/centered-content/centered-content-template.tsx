import type { ReactNode } from "react"

type CenteredContentTemplateProps = {
  children: ReactNode
}

export function CenteredContentTemplate({
  children,
}: CenteredContentTemplateProps) {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        {children}
      </div>
    </div>
  )
}
