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
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-midnight-50">Inscription</h1>
      {err && <div className="mb-3 text-red-400">{err}</div>}
      <form onSubmit={submit} className="space-y-4">
        <Input label="Nom" value={name} onChange={(e)=>setName(e.target.value)} />
        <Input label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Input label="Mot de passe" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div>
          <Button type="submit" disabled={loading}>{loading? 'En cours...' : "S'inscrire"}</Button>
        </div>
      </form>
    </main>
  );
}
