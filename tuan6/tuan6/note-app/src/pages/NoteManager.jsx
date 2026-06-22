import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { noteService } from '../services/noteService'

export default function NoteManager() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')

  // Fetch notes with useQuery
  const { data: notes = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: () => noteService.getAll(),
  })

  // Filter notes client-side with useMemo
  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes
    const term = search.toLowerCase()
    return notes.filter(note =>
      note.title.toLowerCase().includes(term)
    )
  }, [notes, search])

  // Create mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: (newNote) => noteService.create(newNote),
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] })
      const previousNotes = queryClient.getQueryData(['notes'])
      const tempId = Date.now()
      queryClient.setQueryData(['notes'], (old = []) => [
        { ...newNote, id: tempId },
        ...old,
      ])
      return { previousNotes, tempId }
    },
    onError: (err, newNote, context) => {
      queryClient.setQueryData(['notes'], context.previousNotes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  // Delete mutation with optimistic update + rollback
  const deleteMutation = useMutation({
    mutationFn: (id) => noteService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] })
      const previousNotes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], (old = []) =>
        old.filter(note => note.id !== id)
      )
      return { previousNotes }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['notes'], context.previousNotes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  // Update mutation with optimistic update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => noteService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] })
      const previousNotes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], (old = []) =>
        old.map(note => note.id === id ? { ...note, ...data } : note)
      )
      return { previousNotes }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['notes'], context.previousNotes)
    },
    onSettled: () => {
      setEditingId(null)
      setEditTitle('')
      setEditBody('')
    },
  })

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditBody(note.body)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditBody('')
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBody.trim()) return
    createMutation.mutate({
      userId: 1,
      title: newTitle,
      body: newBody,
    })
    setNewTitle('')
    setNewBody('')
  }

  const handleUpdate = (id) => {
    if (!editTitle.trim() || !editBody.trim()) return
    updateMutation.mutate({ id, data: { title: editTitle, body: editBody } })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Note Manager</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleCreate} className="mb-8 p-6 bg-white rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Body"
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !newTitle.trim() || !newBody.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createMutation.isPending ? 'Adding...' : 'Add Note'}
        </button>
      </form>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notes by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No notes found.</p>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              {editingId === note.id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      disabled={updateMutation.isPending}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{note.title}</h3>
                      <p className="text-gray-600">{note.body}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(note)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(note.id)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
