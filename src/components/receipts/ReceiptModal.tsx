import {
  Package,
  X,
  Download,
  Check,
  Star,
  Clock,
  Shield,
  Zap,
  ReceiptText,
} from "lucide-react";
import React from "react";
import { IReceipt } from "@/types/models/IReceipt";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface ReceiptModalProps {
  receipt: IReceipt;
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | Date) => string;
  getPaymentMethodDisplay: (method: string, gateway: string) => string;
  getMembershipColor: (name: string) => string;
}

export default function ReceiptModal({
  receipt,
  isOpen,
  onClose,
  formatCurrency,
  formatDate,
  getPaymentMethodDisplay,
  getMembershipColor,
}: ReceiptModalProps) {
  if (!isOpen || !receipt) return null;

  // Generate receipt number for display
  const getReceiptNumber = (id: string) => {
    const timestamp = new Date(receipt.createdAt)
      .getTime()
      .toString()
      .slice(-6);
    return `RCP-${timestamp}-${id.slice(-4).toUpperCase()}`;
  };

  // Features for all memberships (clarified)
  const getMembershipFeatures = () => [
    "Full access to every premium course",
    "Enhanced lessons covering vocabulary, grammar, and practice exercises",
    "Length of access is determined by the selected membership option",
  ];

  const features = getMembershipFeatures();
  const receiptNumber = getReceiptNumber(receipt._id.toString());

  const total = receipt.amount;

  const handleDownloadPDF = async (receipt: IReceipt) => {
    // Create a temporary div with receipt content
    const receiptElement = document.getElementById(
      `receipt-content-${receipt._id.toString()}`
    );

    if (receiptElement) {
      const canvas = await html2canvas(receiptElement, {
        backgroundColor: "#202020",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`receipt-${receipt._id.toString()}.pdf`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2B2B2B] border border-[#1D1D1D] rounded-[5px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#2B2B2B] border-b border-[#1D1D1D] px-6 py-4 flex items-center justify-between rounded-t-[5px]">
          <div>
            <h2 className="title !mt-0 !mb-1">Payment Receipt</h2>
            <p className="text-sm text-[#AAAAAA]">Receipt #{receiptNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadPDF(receipt)}
              className="p-2 hover:bg-[#373737] rounded-[5px] transition-colors duration-300 text-[#AAAAAA] hover:text-white"
              title="Print Receipt"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#373737] rounded-[5px] transition-colors duration-300"
            >
              <X className="w-6 h-6 text-[#AAAAAA] hover:text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6" id={`receipt-content-${receipt._id.toString()}`}>
          {/* Payment Success Banner */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-[5px] p-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-[5px] flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Payment Successful
              </h3>
              <p className="text-green-300 text-sm">
                Your payment has been processed. This is a record of your
                purchase.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Transaction & Billing */}
            <div className="space-y-6">
              {/* Transaction Details */}
              <div>
                <h4 className="subtitle-top flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Transaction Information
                </h4>
                <div className="bg-[#1D1D1D] rounded-[5px] p-4 ">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-3 border-b border-[#373737]">
                      <span className="subtext">Receipt Number:</span>
                      <span className="font-mono text-white text-xs">
                        {receiptNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#373737]">
                      <span className="subtext">Transaction ID:</span>
                      <span className="font-mono text-white text-xs break-all ml-2">
                        {receipt.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#373737]">
                      <span className="subtext">Payment Method:</span>
                      <span className="text-white">
                        {getPaymentMethodDisplay(
                          receipt.paymentMethod,
                          receipt.paymentGateway
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#373737]">
                      <span className="subtext">Payment Gateway:</span>
                      <span className="text-white uppercase">
                        {receipt.paymentGateway}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#373737]">
                      <span className="subtext">Purchase Date:</span>
                      <span className="text-white">
                        {formatDate(receipt.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Summary */}
              <div>
                <h4 className="subtitle-top flex items-center gap-2">
                  <ReceiptText className="w-4 h-4" />
                  Billing Summary
                </h4>
                <div className="bg-[#1D1D1D] rounded-[5px] p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2">
                      <span className="subtext">Subtotal:</span>
                      <span className="text-white">
                        {formatCurrency(receipt.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="subtext">Other fees:</span>
                      <span className="text-white">{0}</span>
                    </div>

                    <div className="border-t border-[#373737] pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">
                          Total Amount:
                        </span>
                        <span className="text-xl font-bold text-[#4CC2FF]">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Membership Details */}
            <div className="space-y-6">
              {/* Membership Package */}
              <div>
                <h4 className="subtitle-top flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Membership Package
                </h4>
                <div className="bg-[#1D1D1D] rounded-[5px] p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h5 className="font-bold text-white text-xl mb-2">
                        {receipt.membership.name}
                      </h5>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-[5px] text-sm font-semibold ${getMembershipColor(
                            receipt.membership.name
                          )}`}
                        >
                          <Clock className="w-3 h-3 inline mr-1" />
                          {receipt.membership.duration} days access
                        </span>
                      </div>
                      <p className="subtext text-sm leading-relaxed mb-4">
                        {receipt.membership.description}
                      </p>
                    </div>
                  </div>

                  {/* Validity Period */}
                  <div className="bg-[#373737] rounded p-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="subtext">Activation Date:</span>
                      <span className="text-white">
                        {formatDate(receipt.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="subtext">Duration</span>
                      <span className="text-white">
                        {receipt.membership.duration} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Included */}
              <div>
                <h4 className="subtitle-top flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Features Included
                </h4>
                <div className="bg-[#1D1D1D] rounded-[5px] p-4">
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 py-1">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#373737] mt-8 pt-6">
            <div className="text-center mb-4">
              <p className="text-sm subtext mb-2">
                Thank you for your purchase! This is a record of your payment.
                All memberships allow access to premium courses, lessons, and
                tests. The only difference is the duration of access.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-[#666]">
                <span>Need help? Contact tuyensinhhcm@fpt.edu.vn</span>
                <span>•</span>
                <span>
                  Download our mobile app for the best remote learning
                  experience
                </span>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-[#1A1A1A] rounded p-4 text-center">
              <div className="text-xs text-[#666] space-y-1">
                <p>
                  English Learning Platform • Lô E2a-7, Đường D1, Khu Công nghệ
                  cao, Phường Tăng Nhơn Phú, TP HCM
                </p>
                <p>
                  Email: tuyensinhhcm@fpt.edu.vn • Business Registration: (028)
                  7300 5588
                </p>
                <p>This is an official receipt for your records</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
