"use client";
import { IMembership } from "@/types/membership/membership";
import React, { useState } from "react";
import MembershipCard from "./MembershipCard";
import { baseShadow, membershipColorPalette, toRGBA } from "@/utils/colorUtils";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CheckoutModal({
  isOpen,
  onClose,
  membership,
  index,
  paymentMethod,
  setPaymentMethod,
  checkout,
}: {
  isOpen: boolean;
  onClose: () => void;
  membership: IMembership;
  index: number;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  checkout: (membershipId: string) => Promise<void> | void;
}) {
  const { name, price } = membership;
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const color = membershipColorPalette[index % membershipColorPalette.length];
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 max-w-[100%] max-h-[100%] w-[100%] overflow-y-auto"
      onClick={onClose}
      style={{
        boxShadow: baseShadow(color),
        border: `1px solid ${toRGBA(color, 0.1)}`,
      }}
    >
      <div
        className="flex flex-col md:flex-row w-[98%] max-w-4xl bg-[#2b2b2b] relative animate-fade-in scale-95 opacity-0 transition-all duration-300 shadow-lg border border-[#1D1D1D] rounded-2xl overflow-hidden"
        style={{
          animation: isOpen ? "fadeInScale 0.3s forwards" : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Top-Right Corner) */}
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 text-2xl font-bold leading-none transition-colors duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Left Side: Membership Card (no subscribe button) */}
        <div className="flex-1 h-full min-w-[250px] min-h-[250px]">
          <MembershipCard
            membership={membership}
            index={index}
            hideSubscribeButton={true}
            connectedLayout={true}
          />
        </div>
        {/* Responsive Divider */}
        <div
          className="hidden md:block w-px h-auto mx-2"
          style={{ backgroundColor: toRGBA(color, 0.15) }}
        ></div>
        <div
          className="block md:hidden h-px w-full my-2"
          style={{ backgroundColor: toRGBA(color, 0.15) }}
        ></div>
        {/* Right Side: Payment Options */}
        <div className="flex-1 h-full bg-[#2b2b2b] p-4 md:p-8 rounded-none min-w-[250px] min-h-[250px]">
          <h3 className="text-2xl font-bold mb-6 text-white">
            Order Summary
          </h3>
          <div className="space-y-3 text-[#CFCFCF]">
            <div className="flex justify-between">
              <span>Membership:</span>
              <span className="font-medium text-white">{name}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span className="font-medium">1</span>
            </div>
            <hr className={`border-t border-[${color}] my-3`} />
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="text-lg font-bold text-white">
                {price.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-8 mb-6 text-white">
            Payment Method
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center p-4 bg-[#232323] rounded-lg border border-[#1D1D1D] hover:bg-[#373737] transition-colors duration-200">
              <input
                checked={paymentMethod === "vnpay"}
                onChange={() => setPaymentMethod("vnpay")}
                type="radio"
                name="payment"
                value="vnpay"
                className="mr-4 text-[#4CC2FF] focus:ring-2 focus:ring-[#4CC2FF] focus:ring-opacity-50"
              />
              <span className="text-white font-medium mr-4">VNPay</span>{" "}
              <Image
                src="/vnpay-removebg-preview.png"
                width={50}
                height={50}
                alt=""
              />
            </label>
            <label className="flex items-center p-4 bg-[#232323] rounded-lg border border-[#1D1D1D] hover:bg-[#373737] transition-colors duration-200">
              <input
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                type="radio"
                name="payment"
                value="paypal"
                className="mr-4 text-[#4CC2FF] focus:ring-2 focus:ring-[#4CC2FF] focus:ring-opacity-50"
              />
              <span className="text-white font-medium mr-4">PayPal</span>{" "}
              <Image
                src="/paypal-removebg-preview.png"
                width={50}
                height={50}
                alt=""
              ></Image>
            </label>
          </div>
          <button
            className="mt-8 w-full px-6 py-3 bg-[#4CC2FF] hover:bg-[#48B2E9] text-white rounded-lg shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4CC2FF] focus:ring-opacity-50 font-semibold"
            onClick={async () => {
              setLoading(true);
              try {
                await checkout(membership._id as string);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : "Proceed to Payment"}
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
