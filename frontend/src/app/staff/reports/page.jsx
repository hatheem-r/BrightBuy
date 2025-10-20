"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function StaffReports() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState("sales-summary");

  // Report data states
  const [salesSummary, setSalesSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [quarterlySales, setQuarterlySales] = useState([]);
  const [customerSummary, setCustomerSummary] = useState([]);
  const [inventoryReport, setInventoryReport] = useState([]);
  const [categoryOrders, setCategoryOrders] = useState([]);
  const [inventoryUpdates, setInventoryUpdates] = useState([]);
  const [deliveryEstimates, setDeliveryEstimates] = useState([]);

  // Filter states
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [availableCities, setAvailableCities] = useState([]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== "staff") {
        router.push("/");
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  // Fetch helper data (years and cities)
  useEffect(() => {
    if (!user) return;

    const fetchHelperData = async () => {
      const token = localStorage.getItem("token");

      try {
        // Fetch available years
        const yearsRes = await fetch(
          `${API_BASE_URL}/reports/available-years`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (yearsRes.ok) {
          const yearsData = await yearsRes.json();
          setAvailableYears(yearsData.years);
        }

        // Fetch available cities
        const citiesRes = await fetch(
          `${API_BASE_URL}/reports/available-cities`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setAvailableCities(citiesData.cities);
        }
      } catch (error) {
        console.error("Error fetching helper data:", error);
      }
    };

    fetchHelperData();
  }, [user]);

  // Fetch report data based on active report
  useEffect(() => {
    if (!user) return;

    const fetchReportData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        switch (activeReport) {
          case "sales-summary":
            await fetchSalesSummary(token);
            break;
          case "top-products":
            await fetchTopProducts(token);
            break;
          case "quarterly-sales":
            await fetchQuarterlySales(token);
            break;
          case "customer-summary":
            await fetchCustomerSummary(token);
            break;
          case "inventory-report":
            await fetchInventoryReport(token);
            break;
          case "category-orders":
            await fetchCategoryOrders(token);
            break;
          case "inventory-updates":
            await fetchInventoryUpdates(token);
            break;
          case "delivery-estimates":
            await fetchDeliveryEstimates(token);
            break;
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [
    activeReport,
    user,
    dateRange,
    selectedYear,
    inventoryFilter,
    selectedCity,
  ]);

  // API Fetch Functions
  const fetchSalesSummary = async (token) => {
    const res = await fetch(
      `${API_BASE_URL}/reports/sales-summary?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setSalesSummary(data.data);
    }
  };

  const fetchTopProducts = async (token) => {
    const res = await fetch(
      `${API_BASE_URL}/reports/top-selling-products?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setTopProducts(data.data);
    }
  };

  const fetchQuarterlySales = async (token) => {
    const res = await fetch(
      `${API_BASE_URL}/reports/quarterly-sales?year=${selectedYear}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setQuarterlySales(data.data);
    }
  };

  const fetchCustomerSummary = async (token) => {
    const res = await fetch(
      `${API_BASE_URL}/reports/customer-order-summary?limit=50&minOrders=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setCustomerSummary(data.data);
    }
  };

  const fetchInventoryReport = async (token) => {
    const statusParam =
      inventoryFilter !== "all" ? `&status=${inventoryFilter}` : "";
    const res = await fetch(
      `${API_BASE_URL}/reports/inventory?limit=100${statusParam}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setInventoryReport(data.data);
    }
  };

  const fetchCategoryOrders = async (token) => {
    const res = await fetch(`${API_BASE_URL}/reports/category-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCategoryOrders(data.data);
    }
  };

  const fetchInventoryUpdates = async (token) => {
    const res = await fetch(
      `${API_BASE_URL}/reports/inventory-updates?days=30&limit=50`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setInventoryUpdates(data.data);
    }
  };

  const fetchDeliveryEstimates = async (token) => {
    const cityParam = selectedCity !== "all" ? `&city=${selectedCity}` : "";
    const res = await fetch(
      `${API_BASE_URL}/reports/order-delivery-estimate?limit=50${cityParam}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setDeliveryEstimates(data.data);
    }
  };

  // Export Function
  const handleExport = async (reportType) => {
    const token = localStorage.getItem("token");
    let url = "";

    switch (reportType) {
      case "sales-summary":
        url = `${API_BASE_URL}/reports/export/sales-summary?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
        break;
      case "top-products":
        url = `${API_BASE_URL}/reports/export/top-selling-products?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&limit=10`;
        break;
      case "quarterly-sales":
        url = `${API_BASE_URL}/reports/export/quarterly-sales?year=${selectedYear}`;
        break;
      case "customer-summary":
        url = `${API_BASE_URL}/reports/export/customer-order-summary?limit=50&minOrders=1`;
        break;
      case "inventory-report":
        const statusParam =
          inventoryFilter !== "all" ? `&status=${inventoryFilter}` : "";
        url = `${API_BASE_URL}/reports/export/inventory?limit=100${statusParam}`;
        break;
      case "category-orders":
        url = `${API_BASE_URL}/reports/export/category-orders`;
        break;
      case "inventory-updates":
        url = `${API_BASE_URL}/reports/export/inventory-updates?days=30&limit=50`;
        break;
      case "delivery-estimates":
        const cityParam = selectedCity !== "all" ? `&city=${selectedCity}` : "";
        url = `${API_BASE_URL}/reports/export/order-delivery-estimate?limit=50${cityParam}`;
        break;
    }

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download =
          response.headers
            .get("Content-Disposition")
            ?.split("filename=")[1]
            ?.replace(/"/g, "") || "report.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        alert("Failed to export report");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export report");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Reports Center
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Comprehensive reports and analytics for staff members
              </p>
            </div>
            <button
              onClick={() => router.push("/staff/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Navigation */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveReport("sales-summary")}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                activeReport === "sales-summary"
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📈 Sales Summary
            </button>
            <button
              onClick={() => setActiveReport("top-products")}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                activeReport === "top-products"
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🏆 Top Products
            </button>
            <button
              onClick={() => setActiveReport("quarterly-sales")}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                activeReport === "quarterly-sales"
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📅 Quarterly Sales
            </button>
            <button
              onClick={() => setActiveReport("customer-summary")}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                activeReport === "customer-summary"
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              👥 Customer Summary
            </button>
            <button
              onClick={() => setActiveReport("inventory-report")}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                activeReport === "inventory-report"
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📦 Inventory Status
            </button>
            <button
              onClick={() => setActiveReport("category-orders")}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                activeReport === "category-orders"
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🏷️ Category Orders
            </button>
            <button
              onClick={() => setActiveReport("inventory-updates")}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                activeReport === "inventory-updates"
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔄 Inventory Updates
            </button>
            <button
              onClick={() => setActiveReport("delivery-estimates")}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                activeReport === "delivery-estimates"
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🚚 Delivery Estimates
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : (
            <>
              {/* Sales Summary Report */}
              {activeReport === "sales-summary" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Sales Summary
                    </h2>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            startDate: e.target.value,
                          })
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            endDate: e.target.value,
                          })
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                      <button
                        onClick={() => handleExport("sales-summary")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Export XLSX
                      </button>
                    </div>
                  </div>

                  {salesSummary && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {salesSummary.sales.total_orders || 0}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            $
                            {parseFloat(
                              salesSummary.sales.total_revenue || 0
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Unique Customers
                          </p>
                          <p className="text-2xl font-bold text-purple-600">
                            {salesSummary.sales.unique_customers || 0}
                          </p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Avg Order Value
                          </p>
                          <p className="text-2xl font-bold text-orange-600">
                            $
                            {parseFloat(
                              salesSummary.sales.avg_order_value || 0
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {salesSummary.topCategory && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                          <p className="text-sm text-gray-600 mb-1">
                            Top Performing Category
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            🏆 {salesSummary.topCategory.category_name}
                            <span className="text-sm font-normal text-gray-600 ml-2">
                              ({salesSummary.topCategory.order_count} orders)
                            </span>
                          </p>
                        </div>
                      )}

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Inventory Status
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Total Variants
                            </p>
                            <p className="text-lg font-bold">
                              {salesSummary.inventory.total_variants}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">In Stock</p>
                            <p className="text-lg font-bold text-green-600">
                              {salesSummary.inventory.in_stock}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Low Stock</p>
                            <p className="text-lg font-bold text-orange-600">
                              {salesSummary.inventory.low_stock}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Out of Stock
                            </p>
                            <p className="text-lg font-bold text-red-600">
                              {salesSummary.inventory.out_of_stock}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Top Products Report */}
              {activeReport === "top-products" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Top Selling Products
                    </h2>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            startDate: e.target.value,
                          })
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            endDate: e.target.value,
                          })
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                      <button
                        onClick={() => handleExport("top-products")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Export XLSX
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Rank
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Product ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Product Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Quantity Sold
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Total Sales
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {topProducts.length > 0 ? (
                          topProducts.map((product, index) => (
                            <tr
                              key={product.product_id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3">
                                <span
                                  className={`font-bold ${
                                    index < 3
                                      ? "text-yellow-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  #{index + 1}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {product.product_id}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {product.product_name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {product.total_quantity_sold}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                ${parseFloat(product.total_sales).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No sales data available for this period
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quarterly Sales Report */}
              {activeReport === "quarterly-sales" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Quarterly Sales
                    </h2>
                    <div className="flex gap-3">
                      <select
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(parseInt(e.target.value))
                        }
                        className="px-4 py-2 border rounded-lg"
                      >
                        {availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleExport("quarterly-sales")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Export XLSX
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quarterlySales.length > 0 ? (
                      quarterlySales.map((quarter) => (
                        <div
                          key={quarter.quarter}
                          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg"
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Q{quarter.quarter} {selectedYear}
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-600">
                                Total Sales
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                ${parseFloat(quarter.total_sales).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">
                                Total Orders
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {quarter.total_orders}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-center py-8 text-gray-500">
                        No sales data available for {selectedYear}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Summary Report */}
              {activeReport === "customer-summary" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Customer Order Summary
                    </h2>
                    <button
                      onClick={() => handleExport("customer-summary")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Export XLSX
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Customer ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Customer Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Total Orders
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Total Spent
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Avg Order Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {customerSummary.length > 0 ? (
                          customerSummary.map((customer) => (
                            <tr
                              key={customer.customer_id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {customer.customer_id}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {customer.customer_name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {customer.total_orders}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                $
                                {parseFloat(customer.total_spent || 0).toFixed(
                                  2
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                $
                                {(
                                  parseFloat(customer.total_spent || 0) /
                                  customer.total_orders
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No customer data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Inventory Report */}
              {activeReport === "inventory-report" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Inventory Status Report
                    </h2>
                    <select
                      value={inventoryFilter}
                      onChange={(e) => setInventoryFilter(e.target.value)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="all">All Items</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            SKU
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Brand
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Color/Size
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Stock
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {inventoryReport.length > 0 ? (
                          inventoryReport.map((item) => (
                            <tr
                              key={item.variant_id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">
                                {item.sku}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {item.product_name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {item.brand}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {item.color} / {item.size}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                ${parseFloat(item.price).toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold">
                                {item.stock}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    item.status === "In Stock"
                                      ? "bg-green-100 text-green-800"
                                      : item.status === "Low Stock"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No inventory items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Category Orders Report */}
              {activeReport === "category-orders" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Orders by Category
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryOrders.length > 0 ? (
                      categoryOrders.map((category) => (
                        <div
                          key={category.category_id}
                          className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg"
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {category.category_name}
                          </h3>
                          <p className="text-3xl font-bold text-purple-600">
                            {category.total_orders}
                          </p>
                          <p className="text-sm text-gray-600">Total Orders</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-8 text-gray-500">
                        No category data available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Inventory Updates Report */}
              {activeReport === "inventory-updates" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Recent Inventory Updates (Last 30 Days)
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Date/Time
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Staff Member
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            SKU
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Old Qty
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Change
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {inventoryUpdates.length > 0 ? (
                          inventoryUpdates.map((update) => (
                            <tr
                              key={update.update_id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {new Date(update.updated_time).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {update.staff_name}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {update.product_name}
                              </td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">
                                {update.sku}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {update.old_quantity}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`font-semibold ${
                                    update.added_quantity > 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {update.added_quantity > 0 ? "+" : ""}
                                  {update.added_quantity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {update.note || "-"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No inventory updates in the last 30 days
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Delivery Estimates Report */}
              {activeReport === "delivery-estimates" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order Delivery Estimates
                    </h2>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="all">All Cities</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Order ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Customer ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            City
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Zip Code
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Order Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Est. Days
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Est. Delivery
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {deliveryEstimates.length > 0 ? (
                          deliveryEstimates.map((order) => (
                            <tr
                              key={order.order_id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                {order.order_id}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {order.customer_id}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {order.city || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {order.zip_code || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {new Date(
                                  order.order_date
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {order.estimated_delivery_days || "-"} days
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                {order.estimated_delivery_date
                                  ? new Date(
                                      order.estimated_delivery_date
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No delivery estimates available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
