import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const fetchBrands = () => api.get("/brands").then((r) => r.data);
export const fetchProducts = (filter) =>
  api.get("/products", { params: filter ? { filter } : {} }).then((r) => r.data);
export const subscribeNewsletter = (email) =>
  api.post("/newsletter", { email }).then((r) => r.data);
