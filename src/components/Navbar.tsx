import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getJson } from '../lib/api';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setUser(null);
      setBalance(null);
      return;
    }

    getJson('/api/auth/me')
      .then((me) => {
        setUser(me);
        if (me?.role === 'ADMIN') {
          fetchBalance();
        }
      })
      .catch(() => {
        setUser(null);
        setBalance(null);
      });
  }, []);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchBalance();
      return;
    }

    if (user && user.role !== 'ADMIN') {
      setBalance(null);
    }
  }, [user]);

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
    <nav className="border-b border-ink-100 bg-white/80 backdrop-blur-sm text-ink-700 shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">E</div>
          <Link href="/" className="text-xl font-bold tracking-[0.08em] uppercase text-ink-700">E-Library</Link>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/catalog" className="text-ink-500 hover:text-ink-700">Catalogue</Link>
          <Link href="/cart" className="text-ink-500 hover:text-ink-700">Panier</Link>
          <Link href="/dashboard" className="text-ink-500 hover:text-ink-700">Tableau de bord</Link>
          {user ? (
            <>
              {user.role === 'ADMIN' && <Link href="/admin" className="text-ink-500 hover:text-ink-700">Admin</Link>}
              <button onClick={logout} className="text-ink-500 hover:text-ink-700">Déconnexion</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink-500 hover:text-ink-700">Connexion</Link>
            </>
          )}
        </div>

        {user?.role === 'ADMIN' && (
          <div className="hidden items-center gap-2 rounded-full bg-paper-100 px-3 py-2 text-xs text-ink-500 md:flex">
            <span>Solde:</span>
            <span className="font-semibold text-ink-700">{balance !== null ? `${balance.toLocaleString('fr-FR')} FCFA` : '—'}</span>
            <button onClick={fetchBalance} disabled={loadingBalance} className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-ink-600">
              {loadingBalance ? '…' : 'Actualiser'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
