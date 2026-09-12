import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  href?: string;
  label?: string;
};

export default function BackButton({ href, label }: Props){
  const router = useRouter();
  return (
    <button
      onClick={()=> href ? router.push(href) : router.back()}
      className="inline-flex items-center gap-2 px-2 py-1 text-sm text-ink-200 hover:text-ink-50"
      aria-label="Retour"
    >
      <span className="transform -translate-x-0.5">←</span>
      <span>{label||'Retour'}</span>
    </button>
  );
}
