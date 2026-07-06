import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { projectsApi } from "@/lib/api/projects.api"
import { uploadsApi } from "@/lib/api/uploads.api"
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/models/projects/project.model"
import { useAuth } from "@/providers/auth/auth.provider"

export function useProjectFormViewModel() {
  const { id } = useParams()
  const isNew = !id || id === "new"
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { can } = useAuth()

  const projectQuery = useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsApi.get(id!),
    enabled: !isNew && !!id,
  })

  const taxonomiesQuery = useQuery({
    queryKey: ["taxonomies"],
    queryFn: async () => {
      const [categories, technologies, tags] = await Promise.all([
        projectsApi.categories(),
        projectsApi.technologies(),
        projectsApi.tags(),
      ])
      return {
        categories: categories.data,
        technologies: technologies.data,
        tags: tags.data,
      }
    },
  })

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      repository_url: "",
      demo_url: "",
      thumbnail: "",
      cover: "",
      status: "draft",
      featured: false,
      categories: [],
      technologies: [],
      tags: [],
    },
  })

  useEffect(() => {
    const project = projectQuery.data?.data
    if (!project) return
    form.reset({
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      repository_url: project.repository_url ?? "",
      demo_url: project.demo_url ?? "",
      thumbnail: project.thumbnail ?? "",
      cover: project.cover ?? "",
      status: project.status,
      featured: project.featured,
      categories: project.categories.map((c) => c.id),
      technologies: project.technologies.map((t) => t.id),
      tags: project.tags.map((t) => t.id),
    })
  }, [projectQuery.data, form])

  const saveMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const body = {
        ...values,
        repository_url: values.repository_url || null,
        demo_url: values.demo_url || null,
        thumbnail: values.thumbnail || null,
        cover: values.cover || null,
      }
      if (isNew) {
        return projectsApi.create(body)
      }
      return projectsApi.update(id!, body)
    },
    onSuccess: (res) => {
      toast.success(isNew ? "Projeto criado." : "Projeto atualizado.")
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
      if (isNew) navigate(`/projects/${res.data.id}`, { replace: true })
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Erro ao guardar.")
    },
  })

  const publishMutation = useMutation({
    mutationFn: () => projectsApi.publish(id!),
    onSuccess: () => {
      toast.success("Projeto publicado.")
      void queryClient.invalidateQueries({ queryKey: ["projects", id] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const archiveMutation = useMutation({
    mutationFn: () => projectsApi.archive(id!),
    onSuccess: () => {
      toast.success("Projeto arquivado.")
      void queryClient.invalidateQueries({ queryKey: ["projects", id] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const draftMutation = useMutation({
    mutationFn: () => projectsApi.draft(id!),
    onSuccess: () => {
      toast.success("Projeto em rascunho.")
      void queryClient.invalidateQueries({ queryKey: ["projects", id] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  async function uploadThumbnail(file: File) {
    const result = await uploadsApi.upload(file)
    form.setValue("thumbnail", result.path)
    if (!isNew) {
      await projectsApi.patch(id!, { thumbnail: result.path })
      toast.success("Thumbnail atualizada.")
    }
  }

  async function uploadCover(file: File) {
    const result = await uploadsApi.upload(file)
    form.setValue("cover", result.path)
    if (!isNew) {
      await projectsApi.patch(id!, { cover: result.path })
      toast.success("Cover atualizada.")
    }
  }

  return {
    form,
    isNew,
    isLoading: projectQuery.isLoading,
    isSaving: saveMutation.isPending,
    onSubmit: form.handleSubmit((v) => saveMutation.mutate(v)),
    taxonomies: taxonomiesQuery.data,
    project: projectQuery.data?.data,
    publish: () => publishMutation.mutate(),
    archive: () => archiveMutation.mutate(),
    draft: () => draftMutation.mutate(),
    canPublish: can("projects.publish"),
    canUpdate: can("projects.update"),
    uploadThumbnail,
    uploadCover,
    goBack: () => navigate("/projects"),
  }
}
