type Entry = {
  id: string
  name: string
  message: string
  image_url: string
  created_at: string
}

export default function EntryCard({ entry, variant = 'cute' }: { entry: Entry, variant?: 'cute' | 'formal' }) {
  if (variant === 'formal') {
    return (
      <div className="yearbook-card">
        <div className="yearbook-photo-frame">
          {entry.image_url ? (
            <img src={entry.image_url} alt={entry.name} />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Photo</div>
          )}
        </div>
        <h3 className="yearbook-name">{entry.name}</h3>
        {entry.message && <p className="yearbook-quote">"{entry.message}"</p>}
      </div>
    )
  }

  return (
    <div className="cute-card">
      {entry.image_url && (
        <img src={entry.image_url} alt={entry.name} className="cute-photo" />
      )}
      <div className="flex flex-col flex-grow">
        {entry.message && <p className="cute-message">{entry.message}</p>}
        <div style={{marginTop: 'auto'}}>
          <span className="cute-author">- {entry.name}</span>
          <span className="cute-date">{new Date(entry.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}