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
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4 text-midnight-50">Réservations</h1>
      <Card>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-midnight-100">Document</span>
            <select value={documentId} onChange={(e) => setDocumentId(e.target.value)} className="w-full mt-1 p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50">
              <option value="">— sélectionnez —</option>
              {docs.map((d) => (
                <option key={d.id} value={d.id}>{d.title} (stock: {d.stock})</option>
              ))}
            </select>
          </label>

          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="block text-sm">
            <span className="text-midnight-100">Quantité</span>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50" />
          </label>

          <div>
            <Button onClick={reserve}>Réserver</Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
