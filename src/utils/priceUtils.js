export const calculateDiscount = (actual, offer) => {
  if (!actual || !offer) return 0;
  return Math.round(((actual - offer) / actual) * 100);
};
