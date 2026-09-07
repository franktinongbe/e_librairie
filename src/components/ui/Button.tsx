type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline'
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props){
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-2.5 font-medium tracking-[0.02em] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  const variants: Record<string,string> = {
    primary: 'bg-amber-300 text-ink-700 hover:bg-amber-200 focus:ring-amber-200 shadow-sm',
    ghost: 'bg-white/60 text-ink-600 hover:bg-white focus:ring-amber-200 border border-ink-100',
    outline: 'bg-transparent border border-ink-200 text-ink-600 hover:bg-ink-600 hover:text-paper-50 focus:ring-ink-200'
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>{children}</button>
  )
}
