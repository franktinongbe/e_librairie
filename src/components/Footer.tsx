export default function Footer(){
  return (
    <footer className="mt-8 bg-midnight-900 text-midnight-200 py-4 border-t border-midnight-700">
      <div className="container text-center text-sm">© {new Date().getFullYear()} E-Library</div>
    </footer>
  )
}
