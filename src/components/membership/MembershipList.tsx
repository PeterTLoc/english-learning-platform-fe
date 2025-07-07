"use client";
import { IMembership } from "@/types/membership/membership";
import { ObjectId } from "mongoose";
import React, { useState } from "react";
import MembershipCard from "./MembershipCard";
import CheckoutModal from "./CheckoutModal";
import { useToast } from "@/context/ToastContext";
import PaymentService from "@/services/PaymentService";

const paymentService = new PaymentService();
export default function MembershipList({
  memberships,
}: {
  memberships: IMembership[] | [];
}) {
  const [ModalState, setModalState] = useState<{
    isOpen: boolean;
    membership: IMembership | null;
    index: number;
  }>({ isOpen: false, membership: null, index: -1 });

  const [paymentMethod, setPaymentMethod] = useState("");
  const { showToast } = useToast();

  const openModal = (membership: IMembership, index: number) => {
    setModalState({ isOpen: true, membership, index });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, membership: null, index: -1 });
  };

  const checkout = async (membershipId: string) => {
    try {
      if (!paymentMethod || paymentMethod === "") {
        showToast("Please select a payment method to proceed", "error");
        return;
      }

      if (paymentMethod === "vnpay") {
        const response = await paymentService.createVNPayPayment(membershipId);
        window.location.href = response.link;
      }

      if (paymentMethod === "paypal") {
        const response = await paymentService.createPaypalPayment(membershipId);
        window.location.href = response.link;
      }
    } catch (error) {
      showToast((error as Error).message, "error");
    }
  };
  
  return (
    <div className="flex justify-center items-center w-full gap-6">
      {memberships && memberships.length > 0 ? (
        memberships.map((membership: IMembership, index: number) => (
          <div key={membership._id}>
            <MembershipCard
              membership={membership}
              index={index}
              openModal={() => openModal(membership, index)}
            />
          </div>
        ))
      ) : (
        <div className="bg-[#2b2b2b] rounded-lg p-8 text-center">
          <p className="text-[#CFCFCF] text-lg">No memberships found.</p>
        </div>
      )}

      {ModalState.isOpen && ModalState.membership && (
        <CheckoutModal
          isOpen={ModalState.isOpen}
          onClose={closeModal}
          membership={ModalState.membership}
          index={ModalState.index}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          checkout={checkout}
        />
      )}
    </div>
  );
}
