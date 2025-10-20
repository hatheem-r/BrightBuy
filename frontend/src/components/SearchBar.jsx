"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { productsAPI } from "@/services/api";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const router = useRouter();

  // Fetch all product names on component mount
  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const products = await productsAPI.getProductNames();
        setAllProducts(products);
      } catch (error) {
        // Silently try fallback to getAllProducts
        try {
          const allProds = await productsAPI.getAllProducts();
          // Extract just name, brand, and product_id for autocomplete
          const simplified = allProds.map(p => ({
            product_id: p.product_id,
            name: p.name,
            brand: p.brand || ''
          }));
          setAllProducts(simplified);
          console.log("Using fallback product data for search autocomplete");
        } catch (fallbackError) {
          console.warn("Could not load product data for search autocomplete:", fallbackError.message);
          // Set empty array to prevent further errors
          setAllProducts([]);
        }
      }
    };

    fetchProductNames();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [searchTerm, allProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
    router.push(`/products/${product.product_id}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="font-bold text-primary">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative flex-1 max-w-2xl mx-4" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
          placeholder="Search for products..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-text-primary"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((product, index) => (
            <div
              key={product.product_id}
              onClick={() => handleSuggestionClick(product)}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                index === selectedIndex
                  ? "bg-primary/10"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-text-primary font-medium">
                    {highlightMatch(product.name, searchTerm)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {highlightMatch(product.brand, searchTerm)}
                  </div>
                </div>
                <i className="fas fa-arrow-right text-gray-400 text-sm"></i>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && searchTerm.trim() && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4">
          <p className="text-text-secondary text-center">
            No products found for "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
