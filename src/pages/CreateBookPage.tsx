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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Yearbook App</h1>
        <p className="text-gray-500 mb-6">Create a yearbook and share it with everyone!</p>

        <label className="block text-sm font-medium text-gray-700 mb-1">Yearbook title</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="e.g. Class of 2025"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
        >
          {loading ? 'Creating...' : 'Create Yearbook →'}
        </button>
      </div>
    </div>
  )
}