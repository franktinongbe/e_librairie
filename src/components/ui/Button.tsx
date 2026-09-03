type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline'
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props){
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  const variants: Record<string,string> = {
    primary: 'bg-midnight-500 text-white hover:bg-midnight-400 focus:ring-midnight-300',
    ghost: 'bg-transparent text-midnight-100 hover:bg-midnight-700/40 focus:ring-midnight-300',
    outline: 'bg-transparent border border-midnight-600 text-midnight-100 hover:bg-midnight-700/40 focus:ring-midnight-300'
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>{children}</button>
  )
}
