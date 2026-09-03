import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getJson } from '../lib/api';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      getJson('/api/auth/me').then(setUser).catch(() => setUser(null));
    }
  }, []);

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.reload();
    }
  }

  return (
    <nav className="bg-midnight-800 text-midnight-50 px-5 py-3 shadow-sm">
      <div className="container flex items-center justify-between">
        <div className="font-bold text-lg tracking-wide text-midnight-50">
          <Link href="/">E-Library</Link>
        </div>
        <div className="flex items-center text-sm">
          <Link href="/catalog" className="ml-4 hover:underline hover:text-midnight-100">Catalogue</Link>
          <Link href="/cart" className="ml-4 hover:underline hover:text-midnight-100">Panier</Link>
          <Link href="/dashboard" className="ml-4 hover:underline hover:text-midnight-100">Tableau de bord</Link>
          {user ? (
            <>
              {user.role === 'ADMIN' && <Link href="/admin" className="ml-4 hover:underline hover:text-midnight-100">Admin</Link>}
              <button onClick={logout} className="ml-4 underline">Déconnexion</button>
            </>
          ) : (
            <>
              <Link href="/login" className="ml-4 hover:underline hover:text-midnight-100">Se connecter</Link>
              <Link href="/register" className="ml-4 hover:underline hover:text-midnight-100">S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
