const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function getInventoryData() {
  try {
    const res = await fetch(`${API_BASE_URL}/inventory`);
    if (!res.ok) {
      // Fallback to empty structure
      return { products: [], orders: [], summary: {} };
    }
    return res.json();
  } catch (e) {
    return { products: [], orders: [], summary: {} };
  }
}

export default { getInventoryData };
