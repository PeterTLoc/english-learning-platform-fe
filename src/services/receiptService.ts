import api from "@/lib/api";

class ReceiptService {
  async getReceipts(id: string, page: number = 1, size: number = 5) {
    const response = await api.get(
      `/api/receipts/${id}/users?page=${page}&size=${size}`
    );
    return response.data;
  }

  async getReceipt(id: string) {
    const response = await api.get(`/api/receipts/${id}`);
    return response.data;
  }
}

export default ReceiptService;
