import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function EntryForm({ bookId, onSubmit }: { bookId: string; onSubmit: () => void }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    setLoading(true)
    setError('')

    let image_url = ''

    if (image) {
      const path = `${bookId}/${Date.now()}-${image.name}`
      const { error: uploadError } = await supabase.storage
        .from('yearbook-images')
        .upload(path, image)

      if (uploadError) { setError('Image upload failed'); setLoading(false); return }

      const { data } = supabase.storage.from('yearbook-images').getPublicUrl(path)
      image_url = data.publicUrl
    }

    const { error: dbError } = await supabase
      .from('entries')
      .insert([{ book_id: bookId, name, message, image_url }])

    if (dbError) { setError('Could not save entry'); setLoading(false); return }

    setName(''); setMessage(''); setImage(null)
    setLoading(false)
    onSubmit()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="font-bold text-gray-800 text-xl mb-4">Add your entry</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
      <input className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />

      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
      <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400 h-24 resize-none"
        value={message} onChange={e => setMessage(e.target.value)} placeholder="Write something nice..." />

      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="mb-4 text-sm text-gray-500" />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition">
        {loading ? 'Submitting...' : 'Submit Entry'}
      </button>
    </div>
  )
}