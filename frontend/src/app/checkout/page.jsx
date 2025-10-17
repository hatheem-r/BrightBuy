"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { variantsAPI, customerAPI } from "@/services/api";

const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, cartCount, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if this is a "Buy Now" checkout
  const isBuyNow = searchParams.get("buyNow") === "true";
  const buyNowVariantId = searchParams.get("variantId");
  const buyNowQuantity = parseInt(searchParams.get("quantity") || "1", 10);
  const isFromCart = searchParams.get("fromCart") === "true";
  
  // Get selected items from URL (for cart checkout)
  const selectedItemsParam = searchParams.get("selectedItems");
  const selectedVariantIds = selectedItemsParam 
    ? selectedItemsParam.split(',').map(id => parseInt(id, 10))
    : [];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingCustomerData, setLoadingCustomerData] = useState(false);
  const [savedAddressId, setSavedAddressId] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Determine which items to checkout
  const checkoutItems =
    isBuyNow && buyNowProduct
      ? [{ variant: buyNowProduct, quantity: buyNowQuantity }]
      : selectedVariantIds.length > 0
      ? cartItems.filter(item => selectedVariantIds.includes(item.variant.variant_id))
      : cartItems;

  // Calculate totals based on checkout items
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const itemCount = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

  const SHIPPING_COST = 500; // $5.00
  const TAX_RATE = 0.08; // 8% tax
  const taxAmount = subtotal * TAX_RATE;
  const totalAmount = subtotal + SHIPPING_COST + taxAmount;

  // Fetch buy now product details
  useEffect(() => {
    const fetchBuyNowProduct = async () => {
      if (isBuyNow && buyNowVariantId) {
        try {
          setLoadingProduct(true);
          const variantData = await variantsAPI.getVariantById(buyNowVariantId);
          setBuyNowProduct(variantData);
          setLoadingProduct(false);
        } catch (error) {
          console.error("Error fetching product variant:", error);
          setLoadingProduct(false);
          // Fallback to cart if product fetch fails
          router.push("/checkout");
        }
      }
    };

    fetchBuyNowProduct();
  }, [isBuyNow, buyNowVariantId]);

  // Fetch customer profile data
  useEffect(() => {
    const fetchCustomerData = async () => {
      const customerId = localStorage.getItem("customer_id");

      if (!customerId || !user) return;

      try {
        setLoadingCustomerData(true);

        // Fetch customer profile with addresses
        const profileData = await customerAPI.getProfile(customerId);

        // Pre-fill basic customer info
        setShippingInfo((prev) => ({
          ...prev,
          firstName: profileData.first_name || prev.firstName,
          lastName: profileData.last_name || prev.lastName,
          email: profileData.email || prev.email,
          phone: profileData.phone || prev.phone,
        }));

        // Pre-fill address if exists
        if (profileData.addresses && profileData.addresses.length > 0) {
          const defaultAddress =
            profileData.addresses.find((addr) => addr.is_default) ||
            profileData.addresses[0];
          setSavedAddressId(defaultAddress.address_id);
          setShippingInfo((prev) => ({
            ...prev,
            address: defaultAddress.line1 || prev.address,
            address2: defaultAddress.line2 || prev.address2,
            city: defaultAddress.city || prev.city,
            state: defaultAddress.state || prev.state,
            postalCode: defaultAddress.zip_code || prev.postalCode,
          }));
        }

        setLoadingCustomerData(false);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setLoadingCustomerData(false);
        // Don't show error to user, just use empty form
      }
    };

    fetchCustomerData();
  }, [user]);

  useEffect(() => {
    // Check for token using the same keys as AuthContext
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("bb_token") ||
      localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    setLoadingAuth(false);

    // Only redirect to cart if not a buy now checkout and cart is empty
    if (!isBuyNow && cartCount === 0 && !loadingAuth) {
      router.push("/cart");
    }
  }, [cartCount, router, loadingAuth, isBuyNow]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number - only allow digits and limit to 15 characters
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, ""); // Remove non-digits
      if (phoneValue.length <= 15) {
        setShippingInfo((prev) => ({ ...prev, [name]: phoneValue }));
      }
    } else {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (formattedValue.replace(/\s/g, "").length > 16) return;
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .substr(0, 5);
    }

    // Limit CVV to 4 digits
    if (name === "cvv" && value.length > 4) return;

    setCardInfo((prev) => ({ ...prev, [name]: formattedValue }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required shipping fields
    if (!shippingInfo.firstName.trim())
      errors.firstName = "First name is required";
    if (!shippingInfo.lastName.trim())
      errors.lastName = "Last name is required";
    if (!shippingInfo.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email))
      errors.email = "Email is invalid";

    // Phone validation - check if required, numeric, and proper length
    if (!shippingInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(shippingInfo.phone)) {
      errors.phone = "Phone number must contain only digits";
    } else if (shippingInfo.phone.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    } else if (shippingInfo.phone.length > 15) {
      errors.phone = "Phone number must not exceed 15 digits";
    }

    if (!shippingInfo.address.trim()) errors.address = "Address is required";
    if (!shippingInfo.city.trim()) errors.city = "City is required";
    if (!shippingInfo.state.trim()) errors.state = "State is required";
    if (!shippingInfo.postalCode.trim())
      errors.postalCode = "Postal code is required";

    // Card payment validation
    if (paymentMethod === "card") {
      const cardNum = cardInfo.cardNumber.replace(/\s/g, "");
      if (!cardNum) errors.cardNumber = "Card number is required";
      else if (cardNum.length !== 16)
        errors.cardNumber = "Card number must be 16 digits";

      if (!cardInfo.cardName.trim())
        errors.cardName = "Cardholder name is required";

      if (!cardInfo.expiryDate) errors.expiryDate = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate))
        errors.expiryDate = "Invalid format (MM/YY)";

      if (!cardInfo.cvv) errors.cvv = "CVV is required";
      else if (cardInfo.cvv.length < 3) errors.cvv = "CVV must be 3-4 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const customerId = localStorage.getItem("customer_id");

      // Step 1: Update customer basic info (phone)
      if (customerId) {
        await customerAPI.updateInfo(customerId, {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          phone: shippingInfo.phone,
        });

        // Step 2: Save address
        const addressData = {
          address_id: savedAddressId, // Will be null for new address
          line1: shippingInfo.address,
          line2: shippingInfo.address2,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip_code: shippingInfo.postalCode,
          is_default: 1, // Set as default address
        };

        const addressResult = await customerAPI.saveAddress(
          customerId,
          addressData
        );

        // Update saved address ID for future updates
        if (addressResult.address_id) {
          setSavedAddressId(addressResult.address_id);
        }
      }

      // Step 3: Simulate order placement
      // In a real application, you would:
      // - Send order data to backend
      // - Process payment
      // - Create order record
      // - Clear cart if not buy now
      // - Redirect to order confirmation

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just simulate success
      alert(
        `Order placed successfully!\n\nTotal: ${formatCurrency(
          totalAmount
        )}\nPayment: ${
          paymentMethod === "card" ? "Card Payment" : "Cash on Delivery"
        }\n\nYour shipping information has been saved for future orders.`
      );

      // Remove items from cart based on checkout type
      if (isBuyNow && isFromCart && buyNowVariantId) {
        // Single item from cart - remove it
        await removeFromCart(buyNowVariantId);
      } else if (!isBuyNow) {
        // Cart checkout - remove all checked out items
        if (selectedVariantIds.length > 0) {
          // Remove only selected items
          for (const variantId of selectedVariantIds) {
            await removeFromCart(variantId);
          }
        } else {
          // If no selection (shouldn't happen), clear entire cart
          clearCart();
        }
      }

      // Redirect to order confirmation or home
      router.push("/");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingAuth || loadingProduct || loadingCustomerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-text-secondary">
            {loadingProduct
              ? "Loading product..."
              : loadingCustomerData
              ? "Loading your information..."
              : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Checkout
          </h1>
          <div className="flex items-center text-sm text-text-secondary">
            {isBuyNow ? (
              <>
                <Link href="/products" className="hover:text-secondary">
                  Products
                </Link>
                <span className="mx-2">›</span>
                <span className="text-text-primary">Quick Checkout</span>
              </>
            ) : (
              <>
                <Link href="/cart" className="hover:text-secondary">
                  Cart
                </Link>
                <span className="mx-2">›</span>
                <span className="text-text-primary">Checkout</span>
              </>
            )}
          </div>
        </div>

        {isBuyNow && buyNowProduct && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-400 text-blue-800 dark:text-blue-200 p-4 mb-6 rounded-lg">
            <p className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Quick Checkout:</strong> You're purchasing{" "}
                <strong>{buyNowProduct.product_name}</strong> only. Items in
                your cart are not included.
                {isFromCart && (
                  <span className="block mt-1 text-sm">
                    ✓ This item will be automatically removed from your cart after purchase.
                  </span>
                )}
              </span>
            </p>
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 text-yellow-800 dark:text-yellow-200 p-4 mb-6 rounded-lg">
            <p className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Please{" "}
              <Link
                href="/login?redirect=/checkout"
                className="font-semibold underline mx-1"
              >
                login
              </Link>{" "}
              to place an order.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Shipping & Payment Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-background border ${
                        formErrors.firstName
                          ? "border-red-500"
                          : "border-card-border"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                      placeholder="John"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-background border ${
                        formErrors.lastName
                          ? "border-red-500"
                          : "border-card-border"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                      placeholder="Doe"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-background border ${
                        formErrors.email
                          ? "border-red-500"
                          : "border-card-border"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                      placeholder="john.doe@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Phone Number * (10-15 digits)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      maxLength={15}
                      className={`w-full p-3 bg-background border ${
                        formErrors.phone
                          ? "border-red-500"
                          : "border-card-border"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                      placeholder="1234567890"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-background border ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-card-border"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                      placeholder="123 Main Street"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      name="address2"
                      value={shippingInfo.address2}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-background border border-card-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-background border ${
                        formErrors.city
                          ? "border-red-500"
                          : "border-card-border"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                      placeholder="New York"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-background border ${
                        formErrors.state
                          ? "border-red-500"
                          : "border-card-border"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                      placeholder="NY"
                    />
                    {formErrors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-background border ${
                        formErrors.postalCode
                          ? "border-red-500"
                          : "border-card-border"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                      placeholder="10001"
                    />
                    {formErrors.postalCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.postalCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-background border border-card-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Method
                </h2>

                <div className="space-y-3 mb-4">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all has-[:checked]:border-secondary has-[:checked]:bg-secondary/5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-secondary focus:ring-secondary"
                    />
                    <span className="ml-3 font-medium text-text-primary">
                      Credit/Debit Card
                    </span>
                    <div className="ml-auto flex gap-2">
                      <svg className="h-6" viewBox="0 0 48 32" fill="none">
                        <rect width="48" height="32" rx="4" fill="#252525" />
                        <circle cx="18" cy="16" r="8" fill="#EB001B" />
                        <circle cx="30" cy="16" r="8" fill="#F79E1B" />
                      </svg>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all has-[:checked]:border-secondary has-[:checked]:bg-secondary/5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-secondary focus:ring-secondary"
                    />
                    <span className="ml-3 font-medium text-text-primary">
                      Cash on Delivery
                    </span>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="mt-4 space-y-4 p-4 bg-background rounded-md border border-card-border">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardInfo.cardNumber}
                        onChange={handleCardInputChange}
                        className={`w-full p-3 bg-card border ${
                          formErrors.cardNumber
                            ? "border-red-500"
                            : "border-card-border"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary font-mono`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {formErrors.cardNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardInfo.cardName}
                        onChange={handleCardInputChange}
                        className={`w-full p-3 bg-card border ${
                          formErrors.cardName
                            ? "border-red-500"
                            : "border-card-border"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
                        placeholder="John Doe"
                      />
                      {formErrors.cardName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.cardName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={handleCardInputChange}
                          className={`w-full p-3 bg-card border ${
                            formErrors.expiryDate
                              ? "border-red-500"
                              : "border-card-border"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary font-mono`}
                          placeholder="MM/YY"
                        />
                        {formErrors.expiryDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handleCardInputChange}
                          className={`w-full p-3 bg-card border ${
                            formErrors.cvv
                              ? "border-red-500"
                              : "border-card-border"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary font-mono`}
                          placeholder="123"
                          maxLength="4"
                        />
                        {formErrors.cvv && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-card-border shadow-sm sticky top-4">
                <h2 className="text-xl font-semibold border-b border-card-border pb-4 mb-4 text-text-primary">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {checkoutItems.map((item) => {
                    const imageUrl = item.variant.image_url
                      ? `http://localhost:5001${item.variant.image_url}`
                      : null;

                    return (
                      <div
                        key={item.variant.variant_id}
                        className="flex items-start gap-3 pb-3 border-b border-card-border last:border-0"
                      >
                        <div className="w-16 h-16 bg-background rounded-md flex-shrink-0 border border-card-border overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.variant.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-text-secondary">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-medium text-sm text-text-primary truncate">
                            {item.variant.product_name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Qty: {item.quantity}
                          </p>
                          {(item.variant.color || item.variant.size) && (
                            <p className="text-xs text-text-secondary">
                              {item.variant.color}
                              {item.variant.color && item.variant.size && " • "}
                              {item.variant.size}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-sm text-text-primary whitespace-nowrap">
                          {formatCurrency(item.variant.price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-card-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}
                      )
                    </span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span>{formatCurrency(SHIPPING_COST)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-text-primary pt-2 border-t border-card-border">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isLoggedIn || isProcessing}
                  className={`mt-6 w-full py-3 rounded-md font-semibold transition-all flex items-center justify-center ${
                    isLoggedIn && !isProcessing
                      ? "bg-secondary text-white hover:bg-opacity-90 hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : isLoggedIn ? (
                    `Place Order • ${formatCurrency(totalAmount)}`
                  ) : (
                    "Login to Continue"
                  )}
                </button>

                {isLoggedIn && (
                  <p className="text-xs text-text-secondary text-center mt-3">
                    By placing this order, you agree to our{" "}
                    <Link href="/terms" className="underline">
                      Terms & Conditions
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
