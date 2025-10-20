// utils/imageUrl.js
/**
 * Get the full image URL
 * @param {string} imageUrl - The image URL from the database
 * @returns {string|null} - Full image URL or null
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If URL already starts with http/https, return as-is (CDN URL)
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Otherwise, prepend backend URL (local uploaded images)
  const API_SERVER_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:5001";
  return `${API_SERVER_URL}${imageUrl}`;
};
