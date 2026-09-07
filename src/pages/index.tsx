import Head from 'next/head';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getJson } from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCFA } from '../lib/format';

export default function Home() {
  const [health, setHealth] = useState<string>('...');
  const [categories, setCategories] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((j) => setHealth(String(j.status)))
      .catch(() => setHealth('indisponible'));

    getJson('/api/categories').then((c: any) => setCategories(c || [])).catch(() => setCategories([]));
    getJson('/api/documents').then((d: any) => setDocs((d || []).slice(0, 6))).catch(() => setDocs([]));
  }, []);

  function onSearch(e?: any) {
    if (e && e.preventDefault) e.preventDefault();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog');
  }

  return (
    <Layout withSidebar={false}>
      <Head>
        <title>E-Library | Librairie engagée</title>
      </Head>

      <div className="container py-8 md:py-10">
        <section className="bg-hero overflow-hidden rounded-[32px] text-white shadow-editorial mb-10">
          <div className="px-6 md:px-10 py-10 md:py-16">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-paper-100">
                Librairie numérique
              </p>
              <h1 className="text-balance text-4xl md:text-6xl font-bold leading-tight mb-4">
                Les livres qui inspirent, font rêver et ouvrent l’esprit.
              </h1>
              <p className="max-w-xl text-base md:text-lg text-paper-100/90 mb-7">
                Découvrez des œuvres, des essais, des romans et des documents rares dans une expérience de lecture élégante et fluide.
              </p>
              <form onSubmit={onSearch} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher un titre, auteur, sujet..."
                  className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-paper-100/70 outline-none focus:border-amber-200 focus:ring-2 focus:ring-amber-200/60"
                />
                <Button type="submit" className="whitespace-nowrap">Rechercher</Button>
              </form>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/catalog"><Button variant="primary">Voir le catalogue</Button></Link>
                <Link href="/login"><Button variant="ghost">Connexion</Button></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-400 mb-3">Service</div>
            <h3 className="text-xl font-semibold text-ink-600 mb-2">Étude et accès</h3>
            <p className="text-sm text-ink-500">Statut actuel : <span className="font-medium text-ink-600">{health}</span></p>
          </Card>
          <Card className="p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-400 mb-3">Explorer</div>
            <h3 className="text-xl font-semibold text-ink-600 mb-2">Catégories</h3>
            <ul className="space-y-2 text-sm text-ink-500">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link href={`/catalog?category=${c.id}`} className="flex items-center justify-between gap-4 hover:text-ink-600">
                    <span>{c.name}</span>
                    <span className="text-amber-400">({(c.documents || []).length})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-400 mb-3">Sélection</div>
            <h3 className="text-xl font-semibold text-ink-600 mb-2">Mises en avant</h3>
            <div className="space-y-3">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center gap-3">
                  <div className="h-16 w-12 overflow-hidden rounded-lg bg-paper-100 ring-1 ring-ink-100 flex items-center justify-center">
                    {d.image ? <img src={d.image} alt={d.title} className="h-full w-full object-cover" /> : <span className="text-[10px] text-ink-300">Livre</span>}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-ink-600">{d.title}</div>
                    <div className="text-sm text-ink-400">{formatCFA(d.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400 mb-2">Nouveautés</p>
              <h2 className="text-3xl font-semibold text-ink-600">À découvrir</h2>
            </div>
            <Link href="/catalog" className="text-sm font-medium text-ink-500 hover:text-ink-600">Voir tout →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {docs.map((d) => (
              <Card key={d.id} className="flex flex-col h-full">
                <div className="h-56 overflow-hidden rounded-2xl bg-paper-100 mb-4">
                  {d.image ? <img src={d.image} alt={d.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-ink-300">Aucune image</div>}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-2">Edition</div>
                  <h3 className="font-semibold text-xl text-ink-600 mb-2">{d.title}</h3>
                  <p className="text-sm text-ink-500 mb-4">{d.author || 'Auteur inconnu'}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-ink-100">
                    <span className="font-semibold text-ink-600">{formatCFA(d.price)}</span>
                    <div className="flex gap-2">
                      <Link href={`/documents/${d.id}`}><Button variant="ghost">Voir</Button></Link>
                      <Link href="/cart"><Button>Ajouter</Button></Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
