import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const fetchBrands = (category) =>
  api.get("/brands", { params: category ? { category } : {} }).then((r) => r.data);
export const fetchProducts = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);
export const fetchReviews = () => api.get("/reviews").then((r) => r.data);
export const subscribeNewsletter = (email) =>
  api.post("/newsletter", { email }).then((r) => r.data);
