import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function CreateBookPage() {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!title.trim()) { setError('Please enter a title'); return }
    setLoading(true)
    setError('')

    const slug = Math.random().toString(36).substring(2, 10)

    const { error: dbError } = await supabase
      .from('books')
      .insert([{ title, slug }])

    if (dbError) { setError('Something went wrong. Try again.'); setLoading(false); return }

    navigate(`/book/${slug}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <div className="cute-container">
          <h1 className="cute-header">📚 Photobook App</h1>
          <p className="text-gray-500 mb-6 text-center" style={{ fontFamily: "'Patrick Hand', cursive", fontSize: "1.2rem" }}>
            Create a photobook and share it with everyone!
          </p>

          <label className="block text-sm font-bold text-gray-700 mb-1" style={{ fontFamily: "'Patrick Hand', cursive", fontSize: "1.2rem" }}>Yearbook title</label>
          <input
            className="cute-input"
            placeholder="e.g. Class of 2025"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-3 font-bold">{error}</p>}

          <button
            onClick={handleCreate}
            disabled={loading}
            className="cute-btn"
          >
            {loading ? 'Creating...' : 'Create Yearbook →'}
          </button>
        </div>
      </div>

      <div className="mt-auto py-4 font-handwritten text-gray-500 text-center" style={{ fontSize: "1.1rem" }}>
        created with ❤️ and caffeine by <span className="text-purple-600 font-bold">harshkurware22</span>
      </div>
    </div>
  )
}