import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getJson, postJson, putJson, deleteJson } from '@/lib/api';
import { formatCFA } from '@/lib/format';

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // États du formulaire
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('0');
  const [stock, setStock] = useState('0');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [reference, setReference] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');

  // États de statut
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  const load = async () => {
    try {
      const [docsData, catsData, suppsData] = await Promise.all([
        getJson('/api/documents'),
        getJson('/api/categories'),
        getJson('/api/suppliers'),
      ]);
      setDocs(docsData || []);
      setCategories(catsData || []);
      setSuppliers(suppsData || []);
    } catch (e: any) {
      setErr(e.message || 'Erreur lors du chargement des données');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setTitle('');
    setPrice('0');
    setStock('0');
    setImage('');
    setImageFile(null);
    setReference('');
    setCategoryId('');
    setSupplierId('');
  };

  const create = async (e: any) => {
    e.preventDefault();
    setErr('');
    setMsg('');

    try {
      let imageUrl = image;

      // Si un fichier est sélectionné, on le convertit en base64 et on l'envoie à l'API d'upload
      if (imageFile) {
        const toBase64 = (f: File) => new Promise<string>((res, rej) => {
          const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(f);
        });
        const dataUrl = await toBase64(imageFile);
        const uploadData: any = await postJson('/api/upload', { file: dataUrl, name: imageFile.name });
        imageUrl = uploadData.url;
      }

      const payload: any = {
        title,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      };
      if (imageUrl) payload.image = imageUrl;
      if (reference) payload.reference = reference;
      if (categoryId) payload.categoryId = Number(categoryId);
      if (supplierId) payload.supplierId = Number(supplierId);

      await postJson('/api/documents', payload);

      setMsg('Article créé avec succès');
      resetForm();
      await load();
    } catch (e: any) {
      setErr(e.message || 'Erreur lors de la création');
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Colonne gauche : Formulaire & Suggestions */}
          <div className="md:col-span-1 space-y-4">
            
            {/* Formulaire de création */}
            <div className="p-4 rounded-lg bg-midnight-800 border border-midnight-700 shadow-md">
              <h2 className="text-lg font-semibold mb-3 text-midnight-50">Créer un article</h2>
              {err && <div className="text-red-400 text-sm mb-3">{err}</div>}
              {msg && <div className="text-green-400 text-sm mb-3">{msg}</div>}
              
              <form onSubmit={create} className="space-y-3">
                <input
                  placeholder="Titre"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50 text-sm"
                  required
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-midnight-300"
                  />
                  <div className="text-xs text-midnight-300 my-1 text-center">OU</div>
                  <input
                    placeholder="Image (URL)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50 text-sm"
                  />
                </div>
                <input
                  placeholder="ISBN / Référence"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50 text-sm"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="Prix (FCFA)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-1/2 p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50 text-sm"
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-1/2 p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50 text-sm"
                  />
                </div>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50 text-sm w-full"
                >
                  <option value="">— Catégorie —</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.documents?.length || 0})
                    </option>
                  ))}
                </select>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50 text-sm w-full"
                >
                  <option value="">— Fournisseur —</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="px-3 py-2 bg-midnight-500 text-white rounded text-sm hover:bg-midnight-400">
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-2 bg-midnight-700 text-midnight-200 rounded text-sm hover:bg-midnight-600"
                  >
                    Réinitialiser
                  </button>
                </div>
              </form>
            </div>

            {/* Suggestions de renouvellement */}
            <div className="p-4 rounded-lg bg-midnight-800 border border-midnight-700 shadow-md">
              <h3 className="font-semibold text-midnight-50">Suggestions de renouvellement</h3>
              <p className="text-xs text-midnight-300">Catégories avec moins de 5 articles</p>
              <ul className="mt-3 space-y-2">
                {categories
                  .filter((c: any) => (c.documents?.length || 0) < 5)
                  .map((c: any) => (
                    <li
                      key={c.id}
                      className="p-2 rounded bg-midnight-800 border border-midnight-700 flex justify-between items-center"
                    >
                      <div className="text-xs text-midnight-50">
                        {c.name} — {c.documents?.length || 0} articles
                      </div>
                      <button
                        disabled={loadingSuggest}
                        onClick={async () => {
                          if (!confirm(`Créer des mouvements d'approvisionnement pour "${c.name}" ?`)) return;
                          setErr('');
                          setMsg('');
                          setLoadingSuggest(true);
                          try {
                            const docsList = c.documents || [];
                            const promises: Promise<any>[] = [];
                            for (const doc of docsList) {
                              const currentStock = Number(doc.stock || 0);
                              const target = 10;
                              const qty = Math.max(target - currentStock, 0);
                              if (qty > 0) {
                                promises.push(
                                  postJson('/api/movements', {
                                    articleId: Number(doc.id),
                                    quantity: qty,
                                    type: 'ENTREE',
                                  })
                                );
                              }
                            }
                            await Promise.all(promises);
                            setMsg('Mouvements d\'approvisionnement créés.');
                            await load();
                          } catch (e: any) {
                            setErr(e.message || 'Erreur');
                          }
                          setLoadingSuggest(false);
                        }}
                        className="px-2 py-1 text-xs bg-midnight-500 text-white rounded hover:bg-midnight-400 disabled:opacity-50"
                      >
                        Suggérer
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Colonne droite : Liste des articles */}
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-3 text-midnight-50 text-lg">Liste des articles</h2>
            <div className="space-y-3">
              {docs.map((d: any) => (
                <div key={d.id} className="p-4 rounded-lg bg-midnight-800 border border-midnight-700 shadow-md flex items-center justify-between">
                  <div>
                    <div className="font-medium text-midnight-50">{d.title}</div>
                    <div className="text-sm text-midnight-300">
                      Prix: {formatCFA(d.price)} — Stock: {d.stock}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        const newTitle = prompt('Nouveau titre', d.title);
                        if (!newTitle) return;
                        try {
                          await putJson(`/api/documents/${d.id}`, { title: newTitle });
                          await load();
                        } catch (e: any) {
                          setErr(e.message || 'Erreur');
                        }
                      }}
                      className="px-2 py-1 bg-midnight-500 text-white text-xs rounded hover:bg-midnight-400"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Supprimer ce document ?')) return;
                        try {
                          await deleteJson(`/api/documents/${d.id}`);
                          await load();
                        } catch (e: any) {
                          setErr(e.message || 'Erreur');
                        }
                      }}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}