import api from "@/lib/api";

class FlashcardService {
  async getFlashcards(
    id: string,
    page?: number,
    size?: number,
    order?: string,
    sort?: string,
    search?: string
  ) {
    const queryParams = new URLSearchParams();

    if (page) queryParams.set("page", page.toString());
    if (size) queryParams.set("size", size.toString());
    if (search) queryParams.set("search", search);
    if (sort) queryParams.set("sort", sort || "date");
    if (order) queryParams.set("order", order || "desc");

    const response = await api.get(
      `/api/flashcards/${id}/flashcard-set?${queryParams.toString()}`
    );
    return response.data;
  }

  async createFlashcard(
    englishContent: string,
    vietnameseContent: string,
    flashcardSetId: string
  ) {
    const response = await api.post("/api/flashcards", {
      englishContent,
      vietnameseContent,
      flashcardSetId,
    });
    return response.data;
  }

  async updateFlashcard(
    id: string,
    englishContent: string,
    vietnameseContent: string
  ) {
    const response = await api.patch(`/api/flashcards/${id}`, {
      englishContent,
      vietnameseContent,
    });
    return response.data;
  }

  async deleteFlashcard(id: string) {
    const response = await api.delete(`/api/flashcards/${id}`);
    return response.data;
  }

  async getFlashcardById(id: string) {
    const response = await api.get(`/api/flashcards/${id}`);
    return response.data;
  }
}
export default FlashcardService;
