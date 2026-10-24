import axios from "axios";
import { apiUrl } from "../config/api.js";

const getToken = () => localStorage.getItem("vendorToken");

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getCategories = async () => {
  const response = await axios.get(apiUrl("brand/getCategory"), {
    headers: authHeaders(),
  });

  const list = response.data?.categories || response.data?.data || [];
  return list.map((category) => ({
    ...category,
    id: category._id || category.id,
  }));
};

export const addCategory = async ({ name, status }) => {
  const response = await axios.post(
    apiUrl("brand/addCategory"),
    { name, status },
    { headers: authHeaders() },
  );
  return response.data;
};

export const updateCategory = async (id, { name, status }) => {
  const response = await axios.put(
    apiUrl(`brand/updateCategory/${id}`),
    { name, status },
    { headers: authHeaders() },
  );
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(apiUrl(`brand/deleteCategory/${id}`), {
    headers: authHeaders(),
  });
  return response.data;
};
