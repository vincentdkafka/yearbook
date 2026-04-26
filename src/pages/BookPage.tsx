import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import EntryForm from '../components/EntryForm'
import EntryList from '../components/EntryList'

type Book = { id: string; title: string; slug: string; is_open: boolean }
type Entry = { id: string; name: string; message: string; image_url: string; created_at: string }

export default function BookPage() {
  const { slug } = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const loadBook = async () => {
    const { data } = await supabase.from('books').select('*').eq('slug', slug).single()
    if (!data) { setNotFound(true); setLoading(false); return }
    setBook(data)
    loadEntries(data.id)
    setLoading(false)
  }

  const loadEntries = async (bookId: string) => {
    const { data } = await supabase.from('entries').select('*')
      .eq('book_id', bookId).order('created_at', { ascending: false })
    setEntries(data || [])
  }

  useEffect(() => { loadBook() }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (notFound) return <div className="min-h-screen flex items-center justify-center text-gray-500">Yearbook not found 😕</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">📚 {book!.title}</h1>
          <p className="text-gray-400 mt-1 text-sm">Share this link: <span className="font-mono text-purple-600">{window.location.href}</span></p>
        </div>

        {book!.is_open ? (
          <div className="mb-10">
            <EntryForm bookId={book!.id} onSubmit={() => loadEntries(book!.id)} />
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4 mb-10">
            Submissions are closed for this yearbook.
          </div>
        )}

        <EntryList entries={entries} />
      </div>
    </div>
  )
}