import EntryCard from './EntryCard'

type Entry = { id: string; name: string; message: string; image_url: string; created_at: string }

export default function EntryList({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) return (
    <p className="text-gray-400 text-center py-12">No entries yet. Be the first! 🎉</p>
  )
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map(e => <EntryCard key={e.id} entry={e} />)}
    </div>
  )
}