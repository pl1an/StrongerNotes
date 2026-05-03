import { api } from "../api";

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/users/${id}`);
};
