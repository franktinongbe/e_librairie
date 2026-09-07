import { useState } from 'react';
import { postJson } from '../lib/api';
import { useRouter } from 'next/router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const [loading,setLoading]=useState(false);
  const router=useRouter();

  async function submit(e:any){
    e.preventDefault();
    setErr('');
    if (!name || !email || !password) {
      setErr('Tous les champs sont requis');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setErr('Email invalide');
      return;
    }
    if (password.length < 6) {
      setErr('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try{
      await postJson('/api/auth/register',{ name, email, password });
      // login after register
      const login = await postJson('/api/auth/login',{ email, password });
      if (login.token) {
        localStorage.setItem('token', login.token);
        router.push('/');
      }
    }catch(e:any){
      setErr(e.message||'Erreur');
    }finally{
      setLoading(false);
    }
  }

  return (
    <main className="container py-12">
      <div className="mx-auto max-w-md rounded-[28px] border border-ink-100 bg-white/80 p-8 shadow-editorial backdrop-blur-sm">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-amber-400">Rejoignez-nous</p>
        <h1 className="mb-6 text-3xl font-bold text-ink-700">Inscription</h1>
        {err && <div className="mb-3 rounded-full bg-red-50 px-3 py-2 text-sm text-red-600">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Input label="Nom" value={name} onChange={(e)=>setName(e.target.value)} />
          <Input label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <Input label="Mot de passe" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={loading}>{loading? 'En cours...' : "S'inscrire"}</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
