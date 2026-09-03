import Head from 'next/head';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [health, setHealth] = useState<string>('...');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((j) => setHealth(String(j.status)))
      .catch(() => setHealth('unavailable'));
  }, []);

  return (
    <Layout>
      <Head>
        <title>E-Library</title>
      </Head>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-3 text-midnight-50">Bienvenue — E-Library</h1>
          <p className="mb-6 text-midnight-200">Statut service: <strong className="text-midnight-50">{health}</strong></p>
          <div className="flex gap-3">
            <Link href="/catalog" className="btn btn-primary">Voir le catalogue</Link>
            <Link href="/cart" className="btn btn-primary/80 bg-midnight-700 hover:bg-midnight-600">Voir le panier</Link>
            <Link href="/dashboard" className="btn btn-primary/80 bg-midnight-700 hover:bg-midnight-600">Tableau de bord</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
