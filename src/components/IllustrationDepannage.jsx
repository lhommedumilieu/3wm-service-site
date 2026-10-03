export default function IllustrationDepannage() {
  return (
    <svg viewBox="0 0 420 300" role="img" aria-label="Illustration : un ordinateur portable dépanné à distance, avec une coche verte de réussite">
      {/* écran */}
      <rect className="art-screen" x="62" y="22" width="296" height="188" rx="16" />
      <path className="art-bar" d="M62 38a16 16 0 0116-16h264a16 16 0 0116 16v14H62z" />
      <circle className="art-dot" cx="82" cy="37" r="4" />
      <circle className="art-dot" cx="97" cy="37" r="4" />
      <circle className="art-dot" cx="112" cy="37" r="4" />
      {/* contenu */}
      <rect className="art-line-accent" x="86" y="72" width="120" height="12" rx="6" />
      <rect className="art-line" x="86" y="96" width="200" height="10" rx="5" />
      <rect className="art-line" x="86" y="116" width="170" height="10" rx="5" />
      <rect className="art-line" x="86" y="136" width="188" height="10" rx="5" />
      <rect className="art-line-accent" x="86" y="166" width="96" height="22" rx="11" />
      {/* coche de réussite */}
      <circle className="art-ok" cx="296" cy="150" r="34" />
      <path d="M279 150l12 12 22-24" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      {/* socle */}
      <path className="art-base" d="M30 222h360l-22 30a12 12 0 01-10 5H62a12 12 0 01-10-5z" />
      <rect className="art-base" x="170" y="222" width="80" height="8" rx="4" opacity="0.6" />
      {/* curseur du technicien */}
      <path className="art-cursor" d="M214 128l0 46 12-12 9 22 10-4-9-21 17-1z" />
    </svg>
  )
}
