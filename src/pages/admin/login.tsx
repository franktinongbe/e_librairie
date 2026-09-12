import { useState } from 'react';
import { postJson } from '../../lib/api';
import { useRouter } from 'next/router';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    try {
      const res = await postJson('/api/auth/login', { email, password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        router.push('/admin');
      }
    } catch (e: any) {
      setErr(e.message || 'Erreur');
    }
  }

  return (
    <main className="container py-12">
      <div className="mx-auto max-w-md rounded-[28px] border border-ink-100 bg-white/80 p-8 shadow-editorial backdrop-blur-sm">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-amber-600">Espace gérant</p>
        <h1 className="mb-6 text-3xl font-bold text-ink-700">Connexion administrateur</h1>
        {err && <div className="mb-3 rounded-full bg-red-50 px-3 py-2 text-sm text-red-600">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="pt-2">
            <Button type="submit" className="w-full">Se connecter</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
