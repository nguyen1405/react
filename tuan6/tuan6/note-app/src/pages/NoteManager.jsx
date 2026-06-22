import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { noteService } from "../services/noteService"

const Button = ({ variant = "primary", size = "md", className = "", children, ...props }) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-500",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed",
  }
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
)

export default function NoteManager() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editBody, setEditBody] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newBody, setNewBody] = useState("")

  const { data: notes = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: () => noteService.getAll(),
  })

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes
    const term = search.toLowerCase()
    return notes.filter((note) => note.title.toLowerCase().includes(term))
  }, [notes, search])

  const createMutation = useMutation({
    mutationFn: (newNote) => noteService.create(newNote),
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] })
      const previousNotes = queryClient.getQueryData(["notes"])
      const tempId = Date.now()
      queryClient.setQueryData(["notes"], (old = []) => [
        { ...newNote, id: tempId },
        ...old,
      ])
      return { previousNotes, tempId }
    },
    onError: (err, newNote, context) => {
      queryClient.setQueryData(["notes"], context.previousNotes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => noteService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] })
      const previousNotes = queryClient.getQueryData(["notes"])
      queryClient.setQueryData(["notes"], (old = []) =>
        old.filter((note) => note.id !== id)
      )
      return { previousNotes }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["notes"], context.previousNotes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => noteService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] })
      const previousNotes = queryClient.getQueryData(["notes"])
      queryClient.setQueryData(["notes"], (old = []) =>
        old.map((note) => (note.id === id ? { ...note, ...data } : note))
      )
      return { previousNotes }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["notes"], context.previousNotes)
    },
    onSettled: () => {
      setEditingId(null)
      setEditTitle("")
      setEditBody("")
    },
  })

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBody.trim()) return
    createMutation.mutate({ userId: 1, title: newTitle, body: newBody })
    setNewTitle("")
    setNewBody("")
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditBody(note.body)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditBody("")
  }

  const handleUpdate = (id) => {
    if (!editTitle.trim() || !editBody.trim()) return
    updateMutation.mutate({ id, data: { title: editTitle, body: editBody } })
  }

  const handleDelete = (id) => {
    if (window.confirm("Bạn có muốn xóa ghi chú này?")) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <Spinner />

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
          Error: {error.message}
        </div>
      </div>
    )
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Quản lý ghi chú</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{notes.length} ghi chú</p>
          </div>
          <Button variant="primary" onClick={() => refetch()}>Làm mới</Button>
        </div>

        {/* Add Note Form */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thêm ghi chú mới</h2>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Tiêu đề"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Nội dung"
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="flex-[2] px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
            />
            <Button
              type="submit"
              variant="primary"
              className="shrink-0"
              disabled={createMutation.isPending || !newTitle.trim() || !newBody.trim()}
            >
              {createMutation.isPending ? "Đang thêm..." : "Thêm"}
            </Button>
          </form>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍  Tìm kiếm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none transition-all"
          />
        </div>

        {/* Notes List with Inline Edit */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">
              {search ? "Không tìm thấy ghi chú nào" : "Chưa có ghi chú nào"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredNotes.map((note) => (
                <div key={note.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  {editingId === note.id ? (
                    /* Inline Edit Form */
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-medium"
                        autoFocus
                      />
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary" onClick={() => handleUpdate(note.id)} disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? "Đang lưu..." : "Lưu"}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={cancelEdit}>Hủy</Button>
                      </div>
                    </div>
                  ) : (
                    /* Note Display + Click to Edit */
                    <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => startEdit(note)}>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{note.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-3">{note.body}</p>
                      </div>
                      <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="secondary" onClick={() => startEdit(note)}>Sửa</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(note.id)} disabled={deleteMutation.isPending}>Xóa</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
