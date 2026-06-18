// Auth store: JWT in localStorage, axios bearer interceptor, and a useAuth hook.
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TOKEN_KEY = "bas_token";

let currentUser = null;
let initialized = false;
let initPromise = null;
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());

export const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

// Attach the bearer token to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Any 401 means the session is gone — drop the user.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && getToken()) {
      setToken(null);
      currentUser = null;
      emit();
    }
    return Promise.reject(error);
  }
);

async function loadMe() {
  if (!getToken()) {
    currentUser = null;
    initialized = true;
    emit();
    return null;
  }
  try {
    const { data } = await api.get("/auth/me");
    currentUser = data;
  } catch {
    currentUser = null;
    setToken(null);
  }
  initialized = true;
  emit();
  return currentUser;
}

export const authStore = {
  get user() {
    return currentUser;
  },
  get initialized() {
    return initialized;
  },
  init() {
    if (!initPromise) initPromise = loadMe();
    return initPromise;
  },
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.access_token);
    currentUser = data.user;
    initialized = true;
    emit();
    return data.user;
  },
  async register(name, email, password) {
    const { data } = await api.post("/auth/register", { name, email, password });
    setToken(data.access_token);
    currentUser = data.user;
    initialized = true;
    emit();
    return data.user;
  },
  async updateProfile(payload) {
    const { data } = await api.put("/auth/me", payload);
    currentUser = data;
    emit();
    return data;
  },
  logout() {
    setToken(null);
    currentUser = null;
    emit();
  },
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useAuth() {
  const [, force] = useState(0);
  useEffect(() => authStore.subscribe(() => force((n) => n + 1)), []);
  useEffect(() => {
    authStore.init();
  }, []);
  return {
    user: currentUser,
    initialized,
    login: authStore.login,
    register: authStore.register,
    updateProfile: authStore.updateProfile,
    logout: authStore.logout,
  };
}
