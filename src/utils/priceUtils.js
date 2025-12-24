export const calculateDiscount = (mrp, salePrice) => {
  if (!mrp || !salePrice || mrp <= salePrice) return 0;
  return Math.round(((mrp - salePrice) / mrp) * 100);
};

// Get the best discount from sizes array
export const getBestDiscount = (sizes) => {
  if (!sizes || !Array.isArray(sizes) || sizes.length === 0) return 0;
  
  const discounts = sizes.map(size => calculateDiscount(size.mrp, size.salePrice));
  return Math.max(...discounts);
};

// Get the primary size info (usually the first one or the one with best deal)
export const getPrimarySize = (sizes) => {
  if (!sizes || !Array.isArray(sizes) || sizes.length === 0) return null;
  
  // Sort by sortOrder if available, otherwise return first
  const sortedSizes = [...sizes].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return sortedSizes[0];
};

// Format price display
export const formatPrice = (price) => {
  if (!price) return '0';
  return price.toString();
};
