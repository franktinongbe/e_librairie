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
    <aside className="w-56 p-4 bg-midnight-800 border-r border-midnight-700 hidden md:block">
      <ul className="space-y-3">
        <li><Link href="/dashboard" className="text-midnight-50 hover:text-midnight-100">Accueil tableau</Link></li>
        <li><Link href="/catalog" className="text-midnight-50 hover:text-midnight-100">Catalogue</Link></li>
        <li><Link href="/reservations" className="text-midnight-50 hover:text-midnight-100">Réservations</Link></li>
        <li><Link href="/sales" className="text-midnight-50 hover:text-midnight-100">Ventes</Link></li>

        {isAdmin && (
          <>
            <li className="mt-4 font-semibold text-sm text-midnight-200">Admin</li>
            <li><Link href="/admin/documents" className="text-midnight-50 hover:text-midnight-100">Gérer les documents</Link></li>
            <li><Link href="/admin/categories" className="text-midnight-50 hover:text-midnight-100">Gérer les catégories</Link></li>
            <li><Link href="/admin/suppliers" className="text-midnight-50 hover:text-midnight-100">Fournisseurs</Link></li>
            <li><Link href="/admin/invoices" className="text-midnight-50 hover:text-midnight-100">Factures</Link></li>
          </>
        )}
      </ul>
    </aside>
  )
}
