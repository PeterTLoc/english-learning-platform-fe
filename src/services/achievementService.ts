import { AchievementType } from "@/enums/AchievementTypeEnum";
import api from "@/lib/api";

class AchievementService {
  async createAchievement(
    name: string,
    description: string,
    type: AchievementType,
    goal: number
  ) {
    const response = await api.post("/api/achievements", {
      name,
      description,
      type,
      goal,
    });

    return response.data;
  }

  async updateAchievement(
    id: string,
    name?: string,
    description?: string,
    type?: AchievementType,
    goal?: number
  ) {
    const data: Record<string, unknown> = {};
    if (name) data["name"] = name;
    if (description) data["description"] = description;
    if (type) data["type"] = type;
    if (goal) data["goal"] = goal;

    const response = await api.patch(`/api/achievements/${id}`, data);
    return response.data;
  }

  async getAchievements(
    page?: number,
    size?: number,
    order?: string,
    sortBy?: string,
    search?: string,
    type?: AchievementType
  ) {
    const queryParams = new URLSearchParams();
    if (page) queryParams.set("page", page.toString());
    if (size) queryParams.set("size", size.toString());
    if (search) queryParams.set("search", search);
    if (sortBy) queryParams.set("sortBy", sortBy);
    if (order) queryParams.set("order", order);
    if (type) queryParams.set("type", type);
    const response = await api.get(
      `/api/achievements?${queryParams.toString()}`
    );

    return response.data;
  }

  async deleteAchievement(id: string) {
    const response = await api.delete(`/api/achievements/${id}`);
    return response.data;
  }

  async getAchiement(id: string) {
    const response = await api.get(`/api/achievements/${id}`);
    return response.data;
  }
}
export default AchievementService;
