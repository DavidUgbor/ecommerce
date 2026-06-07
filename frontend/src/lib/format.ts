export const formatPrice = (amount: number): string =>
  `₦${Math.round(amount).toLocaleString('en-NG')}`;
