import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import { getJson, postJson } from '../../lib/api';
import { formatCFA } from '../../lib/format';

export default function AdminAddDocument(){
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [price, setPrice] = useState('0');
  const [stock, setStock] = useState('0');
  const [reference, setReference] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const router = useRouter();

  useEffect(()=>{
    getJson('/api/categories').then((c:any)=>setCategories(c||[])).catch(()=>setCategories([]));
    getJson('/api/suppliers').then((s:any)=>setSuppliers(s||[])).catch(()=>setSuppliers([]));
  },[]);

  async function submit(e:any){
    e.preventDefault();
    setErr('');
    if (!title) return setErr('Le titre est requis');
    try{
      const payload: any = { title, author, price: Number(price), stock: Number(stock) };
      if (pageCount && pageCount !== '') payload.pageCount = Number(pageCount);
      if (image) payload.image = image;
      if (imageFile) {
        const toBase64 = (f: File) => new Promise<string>((res, rej) => {
          const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(f);
        });
        payload.image = await toBase64(imageFile);
      }
      if (reference) payload.reference = reference;
      if (categoryId) payload.categoryId = Number(categoryId);
      if (supplierId) payload.supplierId = Number(supplierId);
      await postJson('/api/documents', payload);
      router.push('/admin/documents');
    }catch(e:any){
      setErr(e.message || 'Erreur lors de la création');
    }
  }

  return (
    <Layout>
      <div className="container py-6">
        <PageHeader title="Ajouter un article" backHref="/admin/documents" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <h2 className="text-lg font-semibold mb-3">Ajouter un article</h2>
              {err && <div className="mb-3 text-red-400">{err}</div>}
              <form onSubmit={submit} className="space-y-3">
                <Input label="Titre" value={title} onChange={(e)=>setTitle(e.target.value)} />
                <Input label="Auteur" value={author} onChange={(e)=>setAuthor(e.target.value)} />
                <Input label="Nombre de pages" type="number" min="1" value={pageCount} onChange={(e)=>setPageCount(e.target.value)} />
                <div>
                  <input type="file" accept="image/*" onChange={(e:any)=>setImageFile(e.target.files?.[0]||null)} className="w-full" />
                  <div className="text-sm text-ink-300 mt-1">OU</div>
                  <Input label="Image (URL)" value={image} onChange={(e)=>setImage(e.target.value)} />
                </div>
                <Input label="ISBN / Référence" value={reference} onChange={(e)=>setReference(e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Prix (FCFA)" value={price} onChange={(e)=>setPrice(e.target.value)} />
                  <Input label="Stock" value={stock} onChange={(e)=>setStock(e.target.value)} />
                </div>
                <select value={categoryId} onChange={(e)=>setCategoryId(e.target.value)} className="w-full rounded-md px-3 py-2 bg-ink-700 border border-ink-700 text-ink-50">
                  <option value="">— Aucune —</option>
                  {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={supplierId} onChange={(e)=>setSupplierId(e.target.value)} className="w-full rounded-md px-3 py-2 bg-ink-700 border border-ink-700 text-ink-50">
                  <option value="">— Aucune —</option>
                  {suppliers.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <div className="flex gap-2">
                  <Button type="submit">Créer l'article</Button>
                  <Button type="button" variant="ghost" onClick={()=>router.push('/admin/documents')}>Annuler</Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <h3 className="font-semibold mb-3">Aperçu</h3>
              <div className="flex gap-4 items-start">
                <div className="w-48 h-48 bg-ink-700 rounded overflow-hidden flex items-center justify-center">
                  {imageFile ? <img src={URL.createObjectURL(imageFile)} alt="preview" className="object-contain h-full w-full" /> : (image ? <img src={image} alt="preview" className="object-contain h-full w-full" /> : <div className="text-sm text-ink-300">Aucune image</div>)}
                </div>
                <div>
                  <div className="font-medium text-ink-50 mb-1">{title || 'Titre de l\'article'}</div>
                  <div className="text-sm text-ink-300">{author || 'Auteur'}</div>
                  <div className="text-sm text-ink-300">{pageCount ? `${pageCount} pages` : 'Nombre de pages non défini'}</div>
                  <div className="text-sm text-ink-300 mt-2">Prix: {formatCFA(Number(price)||0)}</div>
                  <div className="text-sm text-ink-300">Stock: {stock}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
