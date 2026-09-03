import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getJson } from '../lib/api';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      getJson('/api/auth/me').then(setUser).catch(() => setUser(null));
      // fetch admin balance if user is admin
      fetchBalance();
    }
  }, []);

  async function fetchBalance() {
    if (typeof window === 'undefined') return;
    setLoadingBalance(true);
    try {
      const b: any = await getJson('/api/admin/balance');
      setBalance(typeof b === 'number' ? b : (b?.balance ?? null));
    } catch (err) {
      setBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  }

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
              {user.role === 'ADMIN' && (
                <>
                  <Link href="/admin" className="ml-4 hover:underline hover:text-midnight-100">Admin</Link>
                  <div className="ml-4 text-sm text-midnight-200 flex items-center">
                    <span className="mr-2">Solde: {balance !== null ? `${balance.toLocaleString('fr-FR')} FCFA` : '—'}</span>
                    <button onClick={fetchBalance} disabled={loadingBalance} className="ml-2 px-2 py-1 text-xs bg-midnight-600 hover:bg-midnight-500 rounded">
                      {loadingBalance ? '…' : 'Actualiser'}
                    </button>
                  </div>
                </>
              )}
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
