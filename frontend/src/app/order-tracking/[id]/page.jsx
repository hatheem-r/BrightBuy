// src/app/order-tracking/[id]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/utils/currency";
import { ordersAPI } from "@/services/api";
import { getImageUrl } from "@/utils/imageUrl";

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          setError("Please login to view order details");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        const response = await ordersAPI.getOrderById(id, token);
        console.log("Order details:", response);
        
        setOrder(response.order);
        setItems(response.items || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, router]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending", icon: "fa-clock" },
      paid: { bg: "bg-green-100", text: "text-green-800", label: "Paid", icon: "fa-check-circle" },
      shipped: { bg: "bg-blue-100", text: "text-blue-800", label: "Shipped", icon: "fa-shipping-fast" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered", icon: "fa-check-double" },
    };
    return statusMap[status] || statusMap.pending;
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    const statusMap = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Payment Pending" },
      paid: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Payment Failed" },
    };
    return statusMap[status] || statusMap.pending;
  };

  // Calculate delivery countdown with real-time updates
  const getDeliveryCountdown = () => {
    if (!order) return null;
    
    const { estimated_delivery_days, status, created_at, delivery_mode, delivery_zip } = order;
    
    if (status === "delivered") {
      return {
        message: "Order has been delivered!",
        timeRemaining: null,
        estimatedDate: null
      };
    }

    // Handle Store Pickup orders
    if (delivery_mode === "Store Pickup") {
      return {
        message: "Ready for pickup at store",
        timeRemaining: null,
        estimatedDate: "Visit store during business hours"
      };
    }
    
    // Calculate delivery for Standard Delivery
    if (estimated_delivery_days) {
      const orderDate = new Date(created_at);
      const estimatedDate = new Date(orderDate);
      estimatedDate.setDate(orderDate.getDate() + estimated_delivery_days);
      estimatedDate.setHours(23, 59, 59, 999); // End of delivery day
      
      // Calculate days remaining only (no hours/minutes/seconds)
      const timeRemaining = estimatedDate - currentTime;
      
      if (timeRemaining > 0) {
        const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
        
        let message = "";
        if (daysRemaining > 1) {
          message = `Estimated delivery: ${daysRemaining} days left`;
        } else if (daysRemaining === 1) {
          message = `Estimated delivery: 1 day left`;
        } else {
          message = "Your order should arrive today!";
        }
        
        return {
          message,
          timeRemaining: { days: daysRemaining },
          estimatedDate: estimatedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
      } else {
        return {
          message: "Delivery is in progress",
          timeRemaining: null,
          estimatedDate: estimatedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
      }
    }
    
    // If no estimated_delivery_days but we have zip code, calculate default (7 days)
    if (delivery_zip) {
      const DEFAULT_DELIVERY_DAYS = 7;
      const orderDate = new Date(created_at);
      const estimatedDate = new Date(orderDate);
      estimatedDate.setDate(orderDate.getDate() + DEFAULT_DELIVERY_DAYS);
      estimatedDate.setHours(23, 59, 59, 999);
      
      const timeRemaining = estimatedDate - currentTime;
      
      if (timeRemaining > 0) {
        const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
        
        return {
          message: `Estimated delivery: ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`,
          timeRemaining: { days: daysRemaining },
          estimatedDate: estimatedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
      }
    }
    
    // Fallback: Calculate based on order date (5-7 days default)
    const orderDate = new Date(created_at);
    const DEFAULT_DAYS = 7;
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + DEFAULT_DAYS);
    
    const timeRemaining = estimatedDate - currentTime;
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    
    return {
      message: `Estimated delivery: ${daysRemaining > 0 ? daysRemaining : 1} ${daysRemaining === 1 ? 'day' : 'days'} left`,
      timeRemaining: { days: daysRemaining > 0 ? daysRemaining : 1 },
      estimatedDate: estimatedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  // Format current time for display
  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatCurrentDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
            <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-black mb-2">Error Loading Order</h2>
            <p className="text-black mb-6">{error}</p>
            <Link
              href="/profile"
              className="inline-block bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
            <i className="fas fa-box-open text-5xl text-gray-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-black mb-2">Order Not Found</h2>
            <p className="text-black mb-6">The order you're looking for doesn't exist.</p>
            <Link
              href="/profile"
              className="inline-block bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.status);
  const paymentBadge = getPaymentBadge(order.payment_status);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Track Your Order
              </h1>
              <p className="text-black font-medium">Order ID: #{order.order_id}</p>
              <p className="text-sm text-black">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Link
              href="/profile"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Profile
            </Link>
          </div>

          {/* Status Badges */}
          <div className="flex gap-4 mb-8">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusBadge.bg} ${statusBadge.text} flex items-center gap-2`}>
              <i className={`fas ${statusBadge.icon}`}></i>
              {statusBadge.label}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${paymentBadge.bg} ${paymentBadge.text}`}>
              {paymentBadge.label}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Status */}
            <div className="lg:col-span-1">
              <div className={`${statusBadge.bg} border ${statusBadge.bg.replace('100', '200')} p-6 rounded-lg text-center flex flex-col justify-center items-center h-full`}>
                <i className={`fas ${statusBadge.icon} text-5xl ${statusBadge.text} mb-4`}></i>
                <h2 className="text-xl font-semibold text-black mb-3">
                  {getDeliveryCountdown().message}
                </h2>

                {/* Days Remaining Display */}
                {getDeliveryCountdown().timeRemaining && (
                  <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4 w-full">
                    <p className="text-sm text-black font-semibold mb-3">Days Remaining:</p>
                    <div className="flex justify-center">
                      <div className="bg-white rounded-lg p-4 shadow-lg">
                        <p className="text-5xl font-bold text-primary">
                          {getDeliveryCountdown().timeRemaining.days}
                        </p>
                        <p className="text-sm text-black text-center mt-2">
                          {getDeliveryCountdown().timeRemaining.days === 1 ? 'Day' : 'Days'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estimated Delivery Date */}
                {getDeliveryCountdown().estimatedDate && (
                  <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-4 w-full">
                    <p className="text-xs text-black mb-1">Expected Delivery:</p>
                    <p className="text-sm font-bold text-black">
                      📅 {getDeliveryCountdown().estimatedDate}
                    </p>
                  </div>
                )}

                {order.delivery_mode && (
                  <p className="text-sm text-black mb-2">
                    <i className="fas fa-truck mr-2"></i>
                    {order.delivery_mode}
                  </p>
                )}
                {order.customer_email && (
                  <p className="text-sm text-black mb-4">
                    <i className="fas fa-envelope mr-2"></i>
                    {order.customer_email}
                  </p>
                )}
                <Link
                  href="/products"
                  className="mt-4 bg-secondary text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right Column - Order Items & Summary */}
            <div className="lg:col-span-2">
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-box text-primary"></i>
                  Items in Your Order ({items.length})
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.order_item_id} className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-white rounded-md mr-4 flex-shrink-0 border border-gray-200 overflow-hidden relative">
                        {item.image_url ? (
                          <Image
                            src={getImageUrl(item.image_url)}
                            alt={item.product_name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="fas fa-image text-2xl"></i>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-grow">
                        <p className="font-semibold text-black">{item.product_name}</p>
                        <p className="text-sm text-black">{item.brand}</p>
                        <div className="flex gap-3 mt-1">
                          {item.color && (
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300 text-black">
                              <i className="fas fa-palette mr-1"></i>
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300 text-black">
                              <i className="fas fa-ruler mr-1"></i>
                              {item.size}
                            </span>
                          )}
                          <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300 text-black">
                            <i className="fas fa-barcode mr-1"></i>
                            SKU: {item.sku}
                          </span>
                        </div>
                      </div>
                      
                      {/* Price & Quantity */}
                      <div className="text-right ml-4">
                        <p className="font-semibold text-black">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </p>
                        <p className="text-sm text-black">
                          {formatCurrency(item.unit_price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-receipt text-primary"></i>
                  Order Summary
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between text-black">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(order.sub_total)}</span>
                    </div>
                    <div className="flex justify-between text-black">
                      <span>Delivery Fee:</span>
                      <span className="font-semibold">{formatCurrency(order.delivery_fee)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-black">
                      <span>Total Paid:</span>
                      <span className="text-primary">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                  
                  {/* Payment Info */}
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex justify-between text-sm text-black">
                      <span>Payment Method:</span>
                      <span className="font-medium">{order.payment_method || 'N/A'}</span>
                    </div>
                    {order.transaction_id && (
                      <div className="flex justify-between text-sm text-black mt-2">
                        <span>Transaction ID:</span>
                        <span className="font-medium">{order.transaction_id}</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery Address */}
                  {(order.line1 || order.delivery_zip) && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-sm font-semibold text-black mb-2">
                        <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                        Delivery Address:
                      </p>
                      <div className="text-sm text-black">
                        {order.line1 && <p>{order.line1}</p>}
                        {order.line2 && <p>{order.line2}</p>}
                        {(order.city || order.state || order.zip_code) && (
                          <p>
                            {[order.city, order.state, order.zip_code]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
