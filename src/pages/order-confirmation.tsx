import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function OrderConfirmation(){
  const router = useRouter();
  const { saleId } = router.query;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Confirmation de commande</h1>
        {saleId ? (
          <div>Merci ! Votre commande a été créée. Id commande: <strong>{saleId}</strong></div>
        ) : (
          <div>Commande créée.</div>
        )}
      </div>
    </Layout>
  );
}
