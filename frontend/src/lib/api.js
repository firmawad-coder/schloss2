import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

// Resolve a possibly-relative image path against the backend URL
export const resolveImage = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_URL}${path}`;
};

export const fetchBrands = (category) =>
  api.get("/brands", { params: category ? { category } : {} }).then((r) => r.data);
export const fetchProducts = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);
export const fetchReviews = () => api.get("/reviews").then((r) => r.data);
export const subscribeNewsletter = (email) =>
  api.post("/newsletter", { email }).then((r) => r.data);

// ---------- Orders ----------
export const createOrder = (payload) => api.post("/orders", payload).then((r) => r.data);
export const fetchOrders = () => api.get("/orders").then((r) => r.data);
export const fetchOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);
