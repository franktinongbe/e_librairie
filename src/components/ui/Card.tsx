export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }){
  return (
    <div className={`rounded-[24px] border border-ink-100 bg-white/80 shadow-[0_16px_40px_rgba(34,29,26,0.06)] p-4 backdrop-blur-sm ${className}`}>{children}</div>
  )
}
