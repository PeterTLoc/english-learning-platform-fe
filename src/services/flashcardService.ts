import api from '@/lib/api';

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
  sortOrder?: 'asc' | 'desc';
}

// Response for paginated flashcard sets
export interface FlashcardSetResponse {
  flashcardSets: FlashcardSet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Get all flashcard sets with pagination and filtering
export const getFlashcardSets = async (params: GetFlashcardSetsParams = {}): Promise<FlashcardSetResponse> => {
  const { page = 1, limit = 12, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const response = await api.get('/api/flashcard-sets', { 
    params: { page, limit, search, sortBy, sortOrder }
  });
  return response.data;
};

// Get a specific flashcard set by ID
export const getFlashcardSet = async (id: string): Promise<FlashcardSet> => {
  const response = await api.get(`/api/flashcard-sets/${id}`);
  return response.data;
};

// Get flashcard sets by user ID
export const getFlashcardSetsByUserId = async (userId: string, params: GetFlashcardSetsParams = {}): Promise<FlashcardSetResponse> => {
  const { page = 1, limit = 12, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const response = await api.get(`/api/flashcard-sets/${userId}/user`, { 
    params: { page, limit, search, sortBy, sortOrder }
  });
  return response.data;
};

// Create a new flashcard set
export const createFlashcardSet = async (data: Partial<FlashcardSet>): Promise<FlashcardSet> => {
  const response = await api.post('/api/flashcard-sets', data);
  return response.data;
};

// Update a flashcard set
export const updateFlashcardSet = async (id: string, data: Partial<FlashcardSet>): Promise<FlashcardSet> => {
  const response = await api.patch(`/api/flashcard-sets/${id}`, data);
  return response.data;
};

// Delete a flashcard set
export const deleteFlashcardSet = async (id: string): Promise<void> => {
  await api.delete(`/api/flashcard-sets/${id}`);
};

// Get flashcards for a specific set
export const getFlashcards = async (flashcardSetId: string): Promise<Flashcard[]> => {
  const response = await api.get(`/api/flashcard/${flashcardSetId}/flashcard-sets`);
  return response.data;
};

// Get a specific flashcard by ID
export const getFlashcard = async (id: string): Promise<Flashcard> => {
  const response = await api.get(`/api/flashcard/${id}`);
  return response.data;
};

// Create a new flashcard
export const createFlashcard = async (data: Partial<Flashcard>): Promise<Flashcard> => {
  const response = await api.post('/api/flashcard', data);
  return response.data;
};

// Update a flashcard
export const updateFlashcard = async (id: string, data: Partial<Flashcard>): Promise<Flashcard> => {
  const response = await api.patch(`/api/flashcard/${id}`, data);
  return response.data;
};

// Delete a flashcard
export const deleteFlashcard = async (id: string): Promise<void> => {
  await api.delete(`/api/flashcard/${id}`);
};