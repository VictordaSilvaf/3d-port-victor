import ReactMarkdown from "react-markdown"

import { Button } from "@workspace/ui/atoms/button"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { ProjectFeedCard } from "@workspace/ui/molecules/project-feed-card"

import type { useProjectDetailViewModel } from "@/viewmodels/projects/use-project-detail.viewmodel"

type ProjectDetailViewProps = ReturnType<typeof useProjectDetailViewModel>

export function ProjectDetailView({
  project,
  related,
  isLoading,
  resolveMediaUrl,
}: ProjectDetailViewProps) {
  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!project) return <p>Projeto não encontrado.</p>

  const cover = resolveMediaUrl(project.cover ?? project.thumbnail)

  return (
    <article className="space-y-8">
      {cover ? (
        <img src={cover} alt={project.title} className="aspect-[21/9] w-full rounded-2xl object-cover" />
      ) : null}

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-white/70">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <span key={t.id} className="rounded-full bg-white/10 px-3 py-1 text-xs">
              {t.name}
            </span>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          {project.repository_url ? (
            <Button variant="outline" asChild>
              <a href={project.repository_url} target="_blank" rel="noreferrer">
                Repositório
              </a>
            </Button>
          ) : null}
          {project.demo_url ? (
            <Button asChild>
              <a href={project.demo_url} target="_blank" rel="noreferrer">
                Demo
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{project.content}</ReactMarkdown>
      </div>

      {project.images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {project.images.map((img) => (
            <figure key={img.id}>
              <img
                src={resolveMediaUrl(img.url) ?? img.url}
                alt={img.caption ?? ""}
                className="rounded-2xl"
              />
              {img.caption ? (
                <figcaption className="text-white/60 mt-2 text-sm">{img.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      {related.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Relacionados</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <ProjectFeedCard
                key={p.id}
                title={p.title}
                href={`/projects/${p.slug}`}
                imageUrl={resolveMediaUrl(p.thumbnail)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
