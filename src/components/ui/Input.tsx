type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export default function Input({ label, className = '', ...rest }: Props){
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-ink-600">{label}</span>}
      <input className={`w-full rounded-full border border-ink-100 bg-white px-4 py-2.5 text-ink-700 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-amber-200 ${className}`} {...rest} />
    </label>
  )
}
