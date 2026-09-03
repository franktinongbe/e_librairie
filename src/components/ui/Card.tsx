export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }){
  return (
    <div className={`rounded-lg shadow-sm bg-midnight-800/60 border border-midnight-700 p-4 ${className}`}>{children}</div>
  )
}
