// Utility function to format currency as Rupees (Rs.)
export const formatCurrency = (value) => {
  const numValue = Number(value || 0);
  return `Rs. ${numValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Alternative compact format for smaller spaces
export const formatCurrencyCompact = (value) => {
  const numValue = Number(value || 0);
  return `Rs. ${numValue.toFixed(2)}`;
};
