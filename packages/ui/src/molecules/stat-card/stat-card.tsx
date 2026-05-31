type StatCardProps = {
  label: string
  value: string
  hint?: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {hint ? (
        <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
      ) : null}
    </article>
  )
}
