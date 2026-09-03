import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getJson } from '../../lib/api';
import Link from 'next/link';

export default function AdminIndex(){
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getJson('/api/auth/me').then((u)=>setUser(u)).catch(()=>setUser(null)).finally(()=>setLoading(false));
  },[]);

  if (loading) return <Layout><div className="p-6">Chargement...</div></Layout>;
  if (!user || user.role !== 'ADMIN') return <Layout><div className="p-6 text-red-600">Accès réservé aux administrateurs</div></Layout>;

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Panneau Admin</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin/categories"><Button variant="ghost">Gérer catégories</Button></Link>
            <Link href="/admin/documents"><Button>Gérer les documents</Button></Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-semibold mb-2">Documents</h3>
            <p className="text-sm text-midnight-300 mb-4">Créer, modifier ou supprimer des articles.</p>
            <div className="flex gap-2">
              <Link href="/admin/documents"><Button>Accéder</Button></Link>
              <Link href="/admin/add-document"><Button variant="ghost">Ajouter</Button></Link>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Fournisseurs</h3>
            <p className="text-sm text-midnight-300 mb-4">Gérer les fournisseurs et leurs coordonnées.</p>
            <div>
              <Link href="/admin/suppliers"><Button>Accéder</Button></Link>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Ventes & Factures</h3>
            <p className="text-sm text-midnight-300 mb-4">Consulter les ventes et générer des factures.</p>
            <div className="flex gap-2">
              <Link href="/admin/invoices"><Button variant="ghost">Factures</Button></Link>
              <Link href="/sales"><Button>Ventes</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
