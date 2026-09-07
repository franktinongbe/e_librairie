import { useEffect, useState } from 'react';
import { getJson, postJson } from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function ReservationsPage() {
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    getJson('/api/documents').then(setDocs).catch(console.error);
  }, []);

  async function reserve() {
    try {
      const res = await postJson('/api/reservations', { documentId: Number(documentId), userEmail: email, quantity });
      alert('Réservation créée: ' + JSON.stringify(res));
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  }

  return (
    <main className="container py-8 md:py-10">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-400">Réservations</p>
      <h1 className="mb-6 text-3xl font-bold text-ink-700">Réserver un titre</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink-600">Document</span>
            <select value={documentId} onChange={(e) => setDocumentId(e.target.value)} className="mt-1 w-full rounded-full border border-ink-100 bg-white px-4 py-2.5 text-ink-700">
              <option value="">— sélectionnez —</option>
              {docs.map((d) => (
                <option key={d.id} value={d.id}>{d.title} (stock: {d.stock})</option>
              ))}
            </select>
          </label>

          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink-600">Quantité</span>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-1 w-full rounded-full border border-ink-100 bg-white px-4 py-2.5 text-ink-700" />
          </label>

          <div className="pt-2">
            <Button onClick={reserve}>Réserver</Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
