import api from "@/lib/api";

class PaymentService {
  async createVNPayPayment(membershipId: string) {
    const response = await api.post("/api/payments/vnpay/create", {
      membershipId,
      platform: "web",
    });

    return response.data;
  }

  async createPaypalPayment(membershipId: string) {
    const response = await api.post("/api/payments/paypal/create", {
      membershipId,
      platform: "web",
    });

    return response.data;
  }
}

export default PaymentService;
