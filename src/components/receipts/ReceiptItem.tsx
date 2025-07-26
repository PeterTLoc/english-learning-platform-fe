import { IReceipt } from "@/types/models/IReceipt";
import {
  Calendar,
  CreditCard,
  Package,
  Eye,
  Clock,
  Shield,
} from "lucide-react";
import React from "react";
import { IMembership } from "@/types/membership/membership";
import { User as IUser } from "@/types/auth/auth";

export interface ReceiptItemProps {
  receipt: IReceipt;
  onViewReceipt: (receipt: IReceipt) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | Date) => string;
  getPaymentMethodDisplay: (method: string, gateway: string) => string;
  getMembershipColor: (name: string) => string;
}

export default function ReceiptItem({
  receipt,
  onViewReceipt,
  formatCurrency,
  formatDate,
  getPaymentMethodDisplay,
  getMembershipColor,
}: ReceiptItemProps) {
  // Generate receipt number for display
  const getReceiptNumber = (id: string) => {
    const timestamp = new Date(receipt.createdAt)
      .getTime()
      .toString()
      .slice(-6);
    return `RCP-${timestamp}-${id.slice(-4).toUpperCase()}`;
  };

  return (
    <div className="bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] p-5 mb-4 hover:bg-[#2D2D2D] transition-all duration-300">
      {/* Header with receipt number and status */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#373737]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#AAAAAA] bg-[#373737] px-2 py-1 rounded">
            {getReceiptNumber(receipt._id.toString())}
          </span>
        </div>
        <div className="text-xs text-[#AAAAAA]">
          Transaction ID: {receipt.transactionId}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white mb-1">
                {receipt.membership.name}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-block px-3 py-1 rounded-[5px] text-xs font-semibold ${getMembershipColor(
                    receipt.membership.name
                  )}`}
                >
                  {receipt.membership.duration} days access
                </span>
                {receipt.membership.duration && (
                  <span className="text-xs text-[#AAAAAA] flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {receipt.membership.duration} days included
                  </span>
                )}
              </div>
              <p className="text-sm text-[#AAAAAA] max-w-md line-clamp-2">
                {receipt.membership.description}
              </p>
            </div>
          </div>

          {/* Enhanced details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#AAAAAA]">
            <div className="flex flex-col items-start justify-center min-h-[56px]">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-[#666]">Purchase Date</span>
              </div>
              <span className="text-white text-xs">
                {formatDate(receipt.createdAt)}
              </span>
            </div>
            <div className="flex flex-col items-start justify-center min-h-[56px]">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-green-400" />
                <span className="text-xs text-[#666]">Payment Method</span>
              </div>
              <span className="text-white text-xs">
                {getPaymentMethodDisplay(
                  receipt.paymentMethod,
                  receipt.paymentGateway
                )}
              </span>
            </div>

            <div className="flex flex-col items-start justify-center min-h-[56px]">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-[#666]">Gateway</span>
              </div>
              <span className="text-white text-xs uppercase">
                {receipt.paymentGateway}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right ml-6">
          <div className="mb-3">
            <div className="text-xs text-[#666] mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(receipt.amount)}
            </div>
          </div>
          <button
            onClick={() => onViewReceipt(receipt)}
            className="bg-white/10 rounded-md inline-flex items-center gap-2 text-sm px-4 py-2"
          >
            <Eye className="w-4 h-4" />
            View Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
