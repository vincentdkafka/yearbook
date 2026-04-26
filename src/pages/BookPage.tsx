import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import EntryForm from '../components/EntryForm'
import EntryList from '../components/EntryList'
import EntryCard from '../components/EntryCard'
import html2canvas from 'html2canvas'

type Book = { id: string; title: string; slug: string; is_open: boolean }
type Entry = { id: string; name: string; message: string; image_url: string; created_at: string }

export default function BookPage() {
  const { slug } = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportImage = async () => {
    if (entries.length === 0) return
    setIsGenerating(true)
    try {
      const element = exportRef.current
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fdfcf0', // Match our --bg-color
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `${book?.title || 'yearbook'}.jpg`
      link.href = canvas.toDataURL('image/jpeg', 0.9)
      link.click()
    } catch (err) {
      console.error('Image Export failed:', err)
      alert('Failed to export image. Check console for details.')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => { loadBook() }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center font-handwritten text-xl text-gray-500">Loading...</div>
  if (notFound) return <div className="min-h-screen flex items-center justify-center font-handwritten text-xl text-red-500">Yearbook not found 😕</div>

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Header */}
        <div className="mb-8 text-center cute-container no-print" style={{maxWidth: "100%", padding: "1.5rem", marginBottom: "2rem", backgroundColor: "var(--pastel-pink)"}}>
          <h1 className="cute-header" style={{marginBottom: "0"}}>📚 {book!.title}</h1>
          <p className="mt-1 font-handwritten" style={{fontSize: "1.2rem", color: "#444"}}>
            Share this link: <span className="font-mono bg-white px-2 py-1" style={{borderRadius: "4px", border: "1px solid var(--ink-color)", wordBreak: "break-all", display: "inline-block", maxWidth: "100%"}}>{window.location.href}</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-4 mt-4">
            <button onClick={handleCopyLink} className="cute-btn" style={{fontSize: "1rem", padding: "0.5rem 1rem", backgroundColor: "var(--pastel-yellow)", flex: 1}}>
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>
            <button 
              onClick={handleExportImage} 
              disabled={isGenerating || entries.length === 0}
              className="cute-btn" 
              style={{fontSize: "1rem", padding: "0.5rem 1rem", flex: 1}}
            >
              {isGenerating ? '⌛ Saving...' : '📸 Export Image'}
            </button>
          </div>
        </div>

        {/* Entry Form Section */}
        {book!.is_open && (
          <div className="mb-10 cute-container no-print" style={{maxWidth: "100%"}}>
            <EntryForm bookId={book!.id} onSubmit={() => loadEntries(book!.id)} />
          </div>
        )}

        {/* Regular View */}
        <div className="no-print entries-wrapper export-container" ref={exportRef}>
          <div className="mb-6">
            <h1 className="cute-header" style={{textAlign: 'left', marginBottom: '0.5rem'}}>📚 {book!.title}</h1>
            <p className="font-handwritten" style={{fontSize: '1.2rem', color: '#666'}}>Yearbook Collection</p>
          </div>
          <EntryList entries={entries} variant="cute" />
        </div>

        {/* Removed Hidden PDF Capture Elements */}
      </div>
    </div>
  )
}