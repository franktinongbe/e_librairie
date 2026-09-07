import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar(){
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch('/api/auth/me');
        if (!res.ok) return setIsAdmin(false);
        const data = await res.json();
        setIsAdmin(data.role === 'ADMIN');
      }catch(_){ setIsAdmin(false); }
    }
    load();
  },[]);

  return (
    <aside className="hidden w-64 border-r border-ink-100 bg-white/70 p-4 backdrop-blur-sm md:block">
      <ul className="space-y-2">
        <li><Link href="/dashboard" className="block rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper-100 hover:text-ink-700">Accueil tableau</Link></li>
        <li><Link href="/catalog" className="block rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper-100 hover:text-ink-700">Catalogue</Link></li>
        <li><Link href="/reservations" className="block rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper-100 hover:text-ink-700">Réservations</Link></li>
        <li><Link href="/sales" className="block rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper-100 hover:text-ink-700">Ventes</Link></li>

        {isAdmin && (
          <>
            <li className="mt-5 border-t border-ink-100 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Admin</li>
            <li><Link href="/admin/documents" className="block rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper-100 hover:text-ink-700">Gérer les documents</Link></li>
            <li><Link href="/admin/categories" className="block rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper-100 hover:text-ink-700">Gérer les catégories</Link></li>
            <li><Link href="/admin/suppliers" className="block rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper-100 hover:text-ink-700">Fournisseurs</Link></li>
            <li><Link href="/admin/invoices" className="block rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper-100 hover:text-ink-700">Factures</Link></li>
          </>
        )}
      </ul>
    </aside>
  )
}
