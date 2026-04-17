import { api } from '../api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<{ data: LoginResponse }>('/api/v1/auth/login', payload);
  return response.data.data;
};
