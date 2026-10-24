import axios from "axios";
import { apiUrl } from "../config/api.js";

const getToken = () => localStorage.getItem("vendorToken");

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getBrands = async () => {
  const response = await axios.get(apiUrl("brand/getBrand"), {
    headers: authHeaders(),
  });

  const list = response.data?.brands || response.data?.data || [];
  return list.map((brand) => ({
    ...brand,
    id: brand._id || brand.id,
  }));
};

export const addBrand = async ({ name, logo }) => {
  const response = await axios.post(
    apiUrl("brand/addBrand"),
    { name, logo },
    { headers: authHeaders() },
  );
  return response.data;
};

export const updateBrand = async (id, { name, logo }) => {
  const response = await axios.put(
    apiUrl(`brand/updateBrand/${id}`),
    { name, logo },
    { headers: authHeaders() },
  );
  return response.data;
};

export const deleteBrand = async (id) => {
  const response = await axios.delete(apiUrl(`brand/deleteBrand/${id}`), {
    headers: authHeaders(),
  });
  return response.data;
};
