import NoteManager from './pages/NoteManager'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">📝 Note Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Week 9 — TanStack Query (React Query) with CRUD + Optimistic Updates
          </p>
        </div>
      </header>
      <main>
        <NoteManager />
      </main>
    </div>
  )
}

export default App
