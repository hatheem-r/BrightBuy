// Utility function to format currency as Dollars ($)
export const formatCurrency = (value) => {
  const numValue = Number(value || 0);
  return `$${numValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Alternative compact format for smaller spaces
export const formatCurrencyCompact = (value) => {
  const numValue = Number(value || 0);
  return `$${numValue.toFixed(2)}`;
};
