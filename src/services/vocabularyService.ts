import api from "@/lib/api";

class VocabularyService {
  async createVocabulary(data: object) {
    const response = await api.post("/api/vocabularies", data);
    return response.data;
  }

  async updateVocabulary(id: string, data: object) {
    const response = await api.patch(`/api/vocabularies/${id}`, data);
    return response.data;
  }

  async deleteVocabulary(id: string) {
    const response = await api.delete(`/api/vocabularies/${id}`);
    return response.data;
  }
}
export default VocabularyService;
