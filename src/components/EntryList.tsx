import EntryCard from './EntryCard'

type Entry = { id: string; name: string; message: string; image_url: string; created_at: string }

export default function EntryList({ entries, variant = 'cute' }: { entries: Entry[], variant?: 'cute' | 'formal' }) {
  if (entries.length === 0) return (
    <p className="font-handwritten text-center py-12" style={{fontSize: "1.5rem", color: "#666"}}>No entries yet. Be the first! 🎉</p>
  )
  return (
    <div className={variant === 'formal' ? "yearbook-grid" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
      {entries.map(e => <EntryCard key={e.id} entry={e} variant={variant} />)}
    </div>
  )
}