"use client";
import { IMembership } from "@/types/models/IMembership";
import { baseShadow, membershipColorPalette } from "@/utils/colorUtils";
import { ObjectId } from "mongoose";
import React from "react";

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
  checkout: (membershipId: string) => void;
}) {
  const { name, description, duration, price } = membership;

  if (!isOpen) return null;

  const color = membershipColorPalette[index % membershipColorPalette.length];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="flex w-[90%] max-w-4xl bg-transparent relative animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button (Top-Right Corner) */}
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 text-2xl font-bold leading-none transition-colors duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Left Side: Membership Card */}
        <div
          className="max-w-sm w-full bg-white rounded-xl shadow-xl p-6"
          style={{
            background: `linear-gradient(180deg, ${color}, rgb(255, 255, 255))`,
            boxShadow: baseShadow(color),
            border: `${color.replace("1)", "1)")} 0px 9px 24px`,
          }}
        >
          {/* Header with Colored Badge */}
          <div className="flex justify-center items-center mb-6 mt-2">
            <div
              className="text-lg font-bold text-white px-4 py-2 rounded-full flex justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              <h2 className="[text-shadow:1px_1px_2.5px_white]">{name}</h2>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-white-700 text-sm mb-6 h-[80px] overflow-y-hidden">
              {description.length > 160
                ? `${description.slice(0, 160)}...`
                : description}
            </p>
          )}

          {/* Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-white-700 font-medium">Duration:</span>
              <span className="text-white-900">{duration} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white-700 font-medium">Price:</span>
              <span className="text-white-900 font-semibold">
                {price.toLocaleString("vn")}₫
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Options */}
        <div className="ml-6 flex-1 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            Order Summary
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Membership:</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span className="font-medium">1</span>
            </div>
            <hr className="border-t border-gray-300 my-3" />
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="text-lg font-bold text-gray-900">
                {price.toLocaleString("vn")}₫
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-8 mb-6 text-gray-900">
            Payment Method
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
              <input
                checked={paymentMethod === "vnpay"}
                onChange={() => setPaymentMethod("vnpay")}
                type="radio"
                name="payment"
                value="vnpay"
                className="mr-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <span className="text-gray-800 font-medium">VNPay</span>
            </label>
            <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
              <input
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                type="radio"
                name="payment"
                value="paypal"
                className="mr-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <span className="text-gray-800 font-medium">PayPal</span>
            </label>
          </div>
          <button
            className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={() => checkout((membership._id as ObjectId).toString())}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
