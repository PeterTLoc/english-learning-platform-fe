import api from "@/lib/api";

// Flashcard Set Types
export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  flashcardCount?: number;
}

// Flashcard Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  flashcardSetId: string;
  createdAt: string;
  updatedAt: string;
}

// Params for fetching flashcard sets
export interface GetFlashcardSetsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Response for paginated flashcard sets
export interface FlashcardSetResponse {
  flashcardSets: FlashcardSet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class FlashcardService {
  // Get all flashcard sets with pagination and filtering
  getFlashcardSets = async (
    params: GetFlashcardSetsParams = {}
  ): Promise<FlashcardSetResponse> => {
    const {
      page = 1,
      limit = 12,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;
    const response = await api.get("/api/flashcard-sets", {
      params: { page, limit, search, sortBy, sortOrder },
    });
    return response.data;
  };

  // Get a specific flashcard set by ID
  getFlashcardSet = async (id: string): Promise<FlashcardSet> => {
    const response = await api.get(`/api/flashcard-sets/${id}`);
    return response.data;
  };

  // Get flashcard sets by user ID
  getFlashcardSetsByUserId = async (
    userId: string,
    params: GetFlashcardSetsParams = {}
  ): Promise<FlashcardSetResponse> => {
    const {
      page = 1,
      limit = 12,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;
    const response = await api.get(`/api/flashcard-sets/${userId}/user`, {
      params: { page, limit, search, sortBy, sortOrder },
    });
    return response.data;
  };

  // Create a new flashcard set
  createFlashcardSet = async (
    data: Partial<FlashcardSet>
  ): Promise<FlashcardSet> => {
    const response = await api.post("/api/flashcard-sets", data);
    return response.data;
  };

  // Update a flashcard set
  updateFlashcardSet = async (
    id: string,
    data: Partial<FlashcardSet>
  ): Promise<FlashcardSet> => {
    const response = await api.patch(`/api/flashcard-sets/${id}`, data);
    return response.data;
  };

  // Delete a flashcard set
  deleteFlashcardSet = async (id: string): Promise<void> => {
    await api.delete(`/api/flashcard-sets/${id}`);
  };

  // Get flashcards for a specific set
  getFlashcards = async (flashcardSetId: string): Promise<Flashcard[]> => {
    const response = await api.get(
      `/api/flashcards/${flashcardSetId}/flashcard-set`
    );
    return response.data;
  };

  // Get a specific flashcard by ID
  getFlashcard = async (id: string): Promise<Flashcard> => {
    const response = await api.get(`/api/flashcards/${id}`);
    return response.data;
  };

  // Create a new flashcard
  createFlashcard = async (data: Partial<Flashcard>): Promise<Flashcard> => {
    const response = await api.post("/api/flashcards", data);
    return response.data;
  };

  // Update a flashcard
  updateFlashcard = async (
    id: string,
    data: Partial<Flashcard>
  ): Promise<Flashcard> => {
    const response = await api.patch(`/api/flashcards/${id}`, data);
    return response.data;
  };

  // Delete a flashcard
  deleteFlashcard = async (id: string): Promise<void> => {
    await api.delete(`/api/flashcards/${id}`);
  };
}

export default FlashcardService;
