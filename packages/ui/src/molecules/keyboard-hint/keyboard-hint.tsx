import { Kbd } from "@workspace/ui/atoms/kbd"

type KeyboardHintProps = {
  before?: string
  keys: string[]
  after?: string
}

export function KeyboardHint({ before, keys, after }: KeyboardHintProps) {
  return (
    <p className="text-muted-foreground font-mono text-xs">
      {before ? <span>{before} </span> : null}
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
      {after ? <span> {after}</span> : null}
    </p>
  )
}
