export default function Footer(){
  return (
    <footer className="mt-10 border-t border-ink-100 bg-white/80 text-ink-500">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm md:flex-row">
        <div className="font-medium text-ink-600">© {new Date().getFullYear()} E-Library</div>
        <div className="flex items-center gap-5">
          <span>Catalogue</span>
          <span>Éditions</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  )
}
