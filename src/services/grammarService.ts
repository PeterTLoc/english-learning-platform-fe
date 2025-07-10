import api from "@/lib/api";

class GrammarService {
  async createGrammar(data: object) {
    const response = await api.post("/api/grammars", data);
    return response.data;
  }

  async updateGrammar(id: string, data: object) {
    const response = await api.patch(`/api/grammars/${id}`, data);
    return response.data;
  }

  async deleteGrammar(id: string) {
    const response = await api.delete(`/api/grammars/${id}`);
    return response.data;
  }
}

export default GrammarService;
