type Entry = {
  id: string
  name: string
  message: string
  image_url: string
  created_at: string
}

export default function EntryCard({ entry }: { entry: Entry }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {entry.image_url && (
        <img src={entry.image_url} alt={entry.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg">{entry.name}</h3>
        {entry.message && <p className="text-gray-500 mt-1 text-sm">{entry.message}</p>}
      </div>
    </div>
  )
}