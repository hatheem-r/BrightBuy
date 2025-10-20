"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerSupport() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([
    {
      id: 1,
      customer_name: "John Doe",
      email: "john@example.com",
      subject: "Order #1234 - Product not delivered",
      status: "open",
      priority: "high",
      created_at: "2025-10-15T10:30:00",
      description:
        "I ordered a laptop but haven't received it yet. It's been 5 days since the expected delivery date.",
    },
    {
      id: 2,
      customer_name: "Jane Smith",
      email: "jane@example.com",
      subject: "Product defect - Camera not working",
      status: "in_progress",
      priority: "medium",
      created_at: "2025-10-16T14:20:00",
      description:
        "The camera I received has a cracked lens. I need a replacement.",
    },
    {
      id: 3,
      customer_name: "Bob Johnson",
      email: "bob@example.com",
      subject: "Question about warranty",
      status: "open",
      priority: "low",
      created_at: "2025-10-17T09:15:00",
      description: "How long is the warranty for gaming laptops?",
    },
  ]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    // Check if user is staff
    if (parsedUser.role !== "staff") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  const handleSubmitResponse = () => {
    if (!response.trim()) return;

    alert(`Response sent to ${selectedTicket.customer_name}:\n\n${response}`);
    setResponse("");
    setSelectedTicket(null);
  };

  const filteredTickets =
    filterStatus === "all"
      ? tickets
      : tickets.filter((t) => t.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Link
              href="/staff/dashboard"
              className="text-primary hover:underline mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-text-primary flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Customer Support
            </h1>
            <p className="text-text-secondary mt-2">
              Manage customer inquiries and support tickets
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
              Open Tickets
            </div>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {tickets.filter((t) => t.status === "open").length}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              In Progress
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {tickets.filter((t) => t.status === "in_progress").length}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="text-sm text-green-800 dark:text-green-300 font-medium">
              Resolved
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {tickets.filter((t) => t.status === "resolved").length}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-sm text-red-800 dark:text-red-300 font-medium">
              High Priority
            </div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {tickets.filter((t) => t.priority === "high").length}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded ${
              filterStatus === "all"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("open")}
            className={`px-4 py-2 rounded ${
              filterStatus === "open"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilterStatus("in_progress")}
            className={`px-4 py-2 rounded ${
              filterStatus === "in_progress"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterStatus("resolved")}
            className={`px-4 py-2 rounded ${
              filterStatus === "resolved"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Ticket Detail View */}
        {selectedTicket && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  {selectedTicket.subject}
                </h2>
                <p className="text-sm text-text-secondary">
                  From: {selectedTicket.customer_name} ({selectedTicket.email})
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Created:{" "}
                  {new Date(selectedTicket.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setResponse("");
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded">
              <h3 className="font-semibold text-text-primary mb-2">
                Description:
              </h3>
              <p className="text-text-primary">{selectedTicket.description}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your Response:
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                placeholder="Type your response to the customer..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmitResponse}
                className="px-6 py-2 bg-primary text-white rounded hover:opacity-90"
              >
                Send Response
              </button>
              <select
                value={selectedTicket.status}
                onChange={(e) =>
                  handleStatusChange(selectedTicket.id, e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        )}

        {/* Tickets List */}
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-card-border">
            <h2 className="text-xl font-bold text-text-primary">
              Support Tickets
            </h2>
            <p className="text-sm text-text-secondary">
              Showing {filteredTickets.length} tickets
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTickets.length === 0 ? (
              <div className="px-6 py-8 text-center text-text-secondary">
                No tickets found
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {ticket.subject}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {ticket.customer_name} • {ticket.email}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary truncate mb-2">
                    {ticket.description}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Created: {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
