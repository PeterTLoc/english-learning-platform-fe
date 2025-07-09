import api from "@/lib/api";

class AiService {
  async askTutor(question: string) {
    const response = await api.post("/api/ai/tutor", { question: question });
    return response.data;
  }

  async getPersonalRecommendationFromAi(id: string) {
    const response = await api.get(`/api/ai/recommentdations/${id}/user`);
    return response.data;
  }
}
export default AiService;
