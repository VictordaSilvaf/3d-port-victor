import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { pagesApi } from "@/lib/api/pages.api"
import type { PageBlock } from "@/lib/api/types"
import {
  BLOCK_LABELS,
  BLOCK_TYPES,
  defaultBlockPayload,
  pageFormSchema,
  type BlockTypeName,
  type PageFormValues,
} from "@/models/pages/page.model"
import { useAuth } from "@/providers/auth/auth.provider"

export function usePageFormViewModel() {
  const { id } = useParams()
  const isNew = !id || id === "new"
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { can } = useAuth()
  const [blocks, setBlocks] = useState<PageBlock[]>([])

  const pageQuery = useQuery({
    queryKey: ["pages", id],
    queryFn: () => pagesApi.get(id!),
    enabled: !isNew && !!id,
  })

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      layout: "default",
      is_home: false,
      status: "draft",
      seo: {},
    },
  })

  useEffect(() => {
    const page = pageQuery.data?.data
    if (!page) return
    form.reset({
      title: page.title,
      slug: page.slug,
      layout: page.layout as PageFormValues["layout"],
      is_home: page.is_home,
      status: page.status,
      seo: page.seo,
    })
    setBlocks(page.blocks)
  }, [pageQuery.data, form])

  const saveMutation = useMutation({
    mutationFn: async (values: PageFormValues) => {
      if (isNew) {
        return pagesApi.create(values)
      }
      return pagesApi.update(id!, values)
    },
    onSuccess: async (res) => {
      const pageId = res.data.id
      if (!isNew || blocks.length > 0) {
        await pagesApi.syncBlocks(pageId, blocks.map((b, i) => ({
          type: b.type,
          order: i + 1,
          payload: b.payload,
          settings: b.settings ?? {},
        })))
      }
      toast.success(isNew ? "Página criada." : "Página atualizada.")
      void queryClient.invalidateQueries({ queryKey: ["pages"] })
      if (isNew) navigate(`/pages/${pageId}`, { replace: true })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const saveBlocksMutation = useMutation({
    mutationFn: () =>
      pagesApi.syncBlocks(
        id!,
        blocks.map((b, i) => ({
          type: b.type,
          order: i + 1,
          payload: b.payload,
          settings: b.settings ?? {},
        }))
      ),
    onSuccess: () => {
      toast.success("Blocos guardados.")
      void queryClient.invalidateQueries({ queryKey: ["pages", id] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const publishMutation = useMutation({
    mutationFn: () => pagesApi.publish(id!),
    onSuccess: () => {
      toast.success("Página publicada.")
      void queryClient.invalidateQueries({ queryKey: ["pages", id] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  function addBlock(type: BlockTypeName) {
    setBlocks((prev) => [
      ...prev,
      {
        type,
        order: prev.length + 1,
        payload: defaultBlockPayload(type),
        settings: {},
      },
    ])
  }

  function updateBlockPayload(index: number, key: string, value: unknown) {
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === index ? { ...b, payload: { ...b.payload, [key]: value } } : b
      )
    )
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  return {
    form,
    isNew,
    isLoading: pageQuery.isLoading,
    isSaving: saveMutation.isPending,
    onSubmit: form.handleSubmit((v) => saveMutation.mutate(v)),
    blocks,
    addBlock,
    updateBlockPayload,
    removeBlock,
    moveBlock,
    saveBlocks: () => saveBlocksMutation.mutate(),
    isSavingBlocks: saveBlocksMutation.isPending,
    publish: () => publishMutation.mutate(),
    canPublish: can("pages.publish"),
    blockTypes: BLOCK_TYPES,
    blockLabels: BLOCK_LABELS,
    goBack: () => navigate("/pages"),
  }
}
