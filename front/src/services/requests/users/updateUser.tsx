import { api } from "../api";

export interface UpdateUserPayload {
  name?: string;
  email?: string;
}

export interface UpdateUserResponse {
  data: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<UpdateUserResponse> => {
  const response = await api.put<UpdateUserResponse>(`/api/v1/users/${id}`, payload);
  return response.data;
};
