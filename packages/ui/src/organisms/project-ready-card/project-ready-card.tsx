import { Button } from "@workspace/ui/atoms/button"

type ProjectReadyCardProps = {
  title: string
  paragraphs: readonly string[]
  buttonLabel: string
}

export function ProjectReadyCard({
  title,
  paragraphs,
  buttonLabel,
}: ProjectReadyCardProps) {
  return (
    <div>
      <h1 className="font-medium">{title}</h1>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <Button className="mt-2">{buttonLabel}</Button>
    </div>
  )
}
