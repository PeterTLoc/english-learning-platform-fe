import api from "@/lib/api";

class FlashcardSetService {
  async getFlashcardSets(
    page: number,
    size: number,
    search: string,
    sort: string,
    order: string,
    userId: string
  ) {
    const queryParams = new URLSearchParams();

    if (page) queryParams.set("page", page.toString());
    if (size) queryParams.set("size", size.toString());
    if (search) queryParams.set("search", search);
    if (sort) queryParams.set("sort", sort);
    if (order) queryParams.set("order", order);
    if (userId) queryParams.set("userId", userId);
    const response = await api.get(
      `/api/flashcard-sets?${queryParams.toString()}`
    );

    return response.data;
  }

  async getFlashcardSetById(id: string) {
    const response = await api.get(`/api/flashcard-sets/${id}`);
    return response.data;
  }

  async createFlashcardSet(name: string, description: string) {
    const response = await api.post("/api/flashcard-sets", {
      name,
      description,
    });
    return response.data;
  }

  async updateFlashcardSet(id: string, name: string, description: string) {
    const response = await api.put(`/api/flashcard-sets/${id}`, {
      name,
      description,
    });
    return response.data;
  }

  async deleteFlashcardSet(id: string) {
    const response = await api.delete(`/api/flashcard-sets/${id}`);
    return response.data;
  }
}

export default FlashcardSetService;
