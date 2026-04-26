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
      const fileExt = image.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const path = `${bookId}/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('yearbook-images')
        .upload(path, image)

      if (uploadError) { 
        setError('Image upload failed: ' + uploadError.message)
        setLoading(false)
        return 
      }

      const { data } = supabase.storage.from('yearbook-images').getPublicUrl(path)
      image_url = data.publicUrl
    }

    const { error: dbError } = await supabase
      .from('entries')
      .insert([{ book_id: bookId, name, message, quote: message, image_url }])

    if (dbError) { 
      setError('Could not save entry: ' + dbError.message)
      setLoading(false)
      return 
    }

    setName(''); setMessage(''); setImage(null)
    setLoading(false)
    onSubmit()
  }

  return (
    <div className="w-full">
      <h2 className="cute-header" style={{textAlign: "left", marginBottom: "1rem"}}>Add your entry</h2>

      <label className="block text-sm font-bold text-gray-700 mb-1" style={{fontFamily: "'Patrick Hand', cursive", fontSize: "1.2rem"}}>Your name *</label>
      <input className="cute-input"
        value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />

      <label className="block text-sm font-bold text-gray-700 mb-1" style={{fontFamily: "'Patrick Hand', cursive", fontSize: "1.2rem"}}>Message</label>
      <textarea className="cute-input cute-textarea"
        value={message} onChange={e => setMessage(e.target.value)} placeholder="Write something nice..." />

      <label className="block text-sm font-bold text-gray-700 mb-1" style={{fontFamily: "'Patrick Hand', cursive", fontSize: "1.2rem"}}>Photo (Optional)</label>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="mb-4 text-sm font-handwritten" style={{fontSize: "1rem"}} />

      {error && <p className="text-red-500 text-sm mb-3 font-bold">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="cute-btn">
        {loading ? 'Submitting...' : 'Submit Entry'}
      </button>
    </div>
  )
}