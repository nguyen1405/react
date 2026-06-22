import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { noteService } from "../services/noteService"

const Button = ({ variant = "primary", size = "md", className = "", children, ...props }) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-500",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 focus:ring-red-500",
  }
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }
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

const ErrorMessage = ({ message }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
      Error: {message}
    </div>
  </div>
)

export default function NoteManager() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ title: "", body: "" })

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
      setEditingNote(null)
      setFormData({ title: "", body: "" })
    },
  })

  const openAddForm = () => {
    setEditingNote(null)
    setFormData({ title: "", body: "" })
    setShowForm(true)
  }

  const openEditForm = (note) => {
    setEditingNote(note)
    setFormData({ title: note.title, body: note.body })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingNote(null)
    setFormData({ title: "", body: "" })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.body.trim()) return
    
    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, data: formData })
    } else {
      createMutation.mutate({ userId: 1, ...formData })
    }
    closeForm()
  }

  const handleDelete = (id) => {
    if (window.confirm("Bạn có muốn xóa ghi chú này?")) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <Spinner />
  if (isError) return <ErrorMessage message={error.message} />

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Quản lý ghi chú
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {notes.length} ghi chú
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => refetch()}>
              Làm mới
            </Button>
            <Button variant="primary" onClick={openAddForm}>
              + Thêm ghi chú
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none transition-all"
          />
        </div>

        {/* Notes Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Tiêu đề
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Nội dung
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-20 text-gray-400 dark:text-gray-500">
                    {search ? "Không tìm thấy ghi chú nào" : "Chưa có ghi chú nào"}
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note) => (
                  <tr
                    key={note.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{note.title}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-500 dark:text-gray-400 line-clamp-2">{note.body}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEditForm(note)}>
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(note.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeForm}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingNote ? "Sửa ghi chú" : "Thêm ghi chú"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nội dung
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" className="flex-1" onClick={closeForm}>
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Đang lưu..."
                      : editingNote
                      ? "Lưu"
                      : "Thêm"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
