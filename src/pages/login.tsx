import { useState } from 'react';
import { postJson } from '../lib/api';
import { useRouter } from 'next/router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
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
        router.push('/');
      }
    } catch (e: any) {
      setErr(e.message || 'Erreur');
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-midnight-50">Connexion</h1>
      {err && <div className="mb-3 text-red-400">{err}</div>}
      <form onSubmit={submit} className="space-y-4">
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div>
          <Button type="submit">Se connecter</Button>
        </div>
      </form>
    </main>
  );
}
