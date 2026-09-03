export function formatCFA(amount: number | string | undefined | null) {
  const v = Number(amount || 0);
  return new Intl.NumberFormat('fr-FR').format(v) + ' FCFA';
}
