import { api } from '../api';

export interface MeResponse {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get<{ data: MeResponse }>('/api/v1/users/me');
  return response.data.data;
};
