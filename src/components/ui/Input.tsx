type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export default function Input({ label, className = '', ...rest }: Props){
  return (
    <label className="block text-sm">
      {label && <span className="block text-midnight-100 mb-1">{label}</span>}
      <input className={`w-full rounded-md px-3 py-2 bg-midnight-800 border border-midnight-700 text-midnight-50 placeholder-midnight-600 focus:outline-none focus:ring-2 focus:ring-midnight-300 ${className}`} {...rest} />
    </label>
  )
}
