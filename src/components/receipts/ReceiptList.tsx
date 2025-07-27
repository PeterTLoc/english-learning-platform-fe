"use client";
import React, { useEffect, useState } from "react";
import ReceiptService from "@/services/receiptService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { IReceipt } from "@/types/models/IReceipt";
import ReceiptItem from "./ReceiptItem";
import ReceiptModal from "./ReceiptModal";
import { Package, ChevronDown } from "lucide-react";

const receiptService = new ReceiptService();
export default function ReceiptList() {
  const router = useRouter();
  const { user } = useAuth();

  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(3);
  const [selectedReceipt, setSelectedReceipt] = useState<IReceipt | null>(null);

  const fetchReceipt = async (pageNum = page, pageSize = size) => {
    if (!user) {
      router.push("/login");
    }
    const response = await receiptService.getReceipts(
      user?._id?.toString(),
      pageNum,
      pageSize
    );
    setReceipts(response.data);
    if (response.totalPages) setTotalPage(response.totalPages);
  };

  useEffect(() => {
    fetchReceipt(page, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, size]);

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return `đ ${new Intl.NumberFormat("vi-VN").format(amount)}`;
  };

  // Format date function
  const formatDate = (dateString: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  // Get payment method display name
  const getPaymentMethodDisplay = (method: string, gateway: string) => {
    const methods = {
      atm: "ATM Card",
      paypal: "PayPal",
      credit: "Credit Card",
      debit: "Debit Card",
    };
    return methods[method] || method.toUpperCase();
  };

  // Get membership tier color - dark theme version
  const getMembershipColor = (name: string) => {
    if (name.toLowerCase().includes("basic"))
      return "bg-green-900/30 text-green-300 border border-green-700/50";
    if (name.toLowerCase().includes("premium"))
      return "bg-blue-900/30 text-blue-300 border border-blue-700/50";
    if (name.toLowerCase().includes("pro"))
      return "bg-purple-900/30 text-purple-300 border border-purple-700/50";
    if (name.toLocaleLowerCase().includes("elite"))
      return "bg-gradient-to-r from-yellow-900/30 to-orange-900/30 text-yellow-300 border border-yellow-700/50";
    return "bg-gray-700/30 text-gray-300 border border-gray-600/50";
  };

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const handleCloseModal = () => {
    setSelectedReceipt(null);
  };

  return (
    <div
      className="max-w-4xl mx-auto p-6"
      style={{ background: "#202020", color: "white" }}
    >
      <div className="flex justify-between">
        <div className="mb-8">
          <h1 className="title">Receipt History</h1>
          <p className="subtext">
            View and manage your membership purchase receipts
          </p>
        </div>
        <div className="mb-6 flex items-center gap-3">
          <span className="text-white text-sm">Show:</span>
          <div className="relative">
            <select
              value={size}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="appearance-none bg-[#373737] text-white border border-[#555] rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#777] cursor-pointer"
            >
              <option value={3}>3 per page</option>
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#AAAAAA] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {receipts && receipts.length > 0 ? (
          receipts.map((receipt) => (
            <ReceiptItem
              key={receipt._id.toString()}
              receipt={receipt}
              onViewReceipt={handleViewReceipt}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getPaymentMethodDisplay={getPaymentMethodDisplay}
              getMembershipColor={getMembershipColor}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#373737] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-[#AAAAAA]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No receipts found
            </h3>
            <p className="subtext">You haven&apos;t made any purchases yet.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="px-3 py-1 rounded-lg bg-[#373737] text-white disabled:opacity-50 hover:bg-[#444] transition-colors"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="text-white">
          Page {page} of {totalPage}
        </span>
        <button
          className="px-3 py-1 rounded-lg bg-[#373737] text-white disabled:opacity-50 hover:bg-[#444] transition-colors"
          onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
          disabled={page >= totalPage}
        >
          Next
        </button>
      </div>

      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={handleCloseModal}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getPaymentMethodDisplay={getPaymentMethodDisplay}
        getMembershipColor={getMembershipColor}
      />
    </div>
  );
}
