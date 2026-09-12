import { useState } from 'react';
import { postJson } from '../lib/api';
import { useRouter } from 'next/router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage(){
  return (
    <main className="container py-12">
      <div className="mx-auto max-w-md rounded-[28px] border border-ink-100 bg-white/80 p-8 shadow-editorial backdrop-blur-sm">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-amber-600">Inscription désactivée</p>
        <h1 className="mb-6 text-3xl font-bold text-ink-700">Inscription</h1>
        <div className="mb-3 text-sm text-ink-700">Les inscriptions publiques sont désactivées. Seul le gérant peut créer des comptes administrateurs.</div>
        <div className="flex gap-2 mt-4">
          <a href="/login" className="inline-block rounded bg-amber-400 px-4 py-2 text-white">Se connecter</a>
          <a href="mailto:admin@example.com" className="inline-block rounded border border-ink-100 px-4 py-2">Contacter le gérant</a>
        </div>
      </div>
    </main>
  );
}
