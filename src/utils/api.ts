import type { Product, ProductCategory } from "../types/product";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (includeAuth) {
    const token = localStorage.getItem("admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// ==========================================
// AUTH API
// ==========================================
export const authApi = {
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: { id: string; name: string; email: string; role: string } }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(data: { name: string; email: string; password: string; role?: string }): Promise<{ success: boolean; token: string; user: { id: string; name: string; email: string; role: string } }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async setupDefaultAdmin(): Promise<{ success: boolean; message: string; user?: any }> {
    const res = await fetch(`${API_BASE}/auth/setup-admin`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ success: boolean; user: { id: string; name: string; email: string; role: string } }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
};

// ==========================================
// PUBLIC PRODUCTS API
// ==========================================
export const publicProductsApi = {
  async getAll(params?: { category?: ProductCategory; featured?: boolean; search?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.featured !== undefined) query.append("featured", String(params.featured));
    if (params?.search) query.append("search", params.search);

    const queryString = query.toString();
    const url = `${API_BASE}/products${queryString ? `?${queryString}` : ""}`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await handleResponse<{ success: boolean; data: Product[] }>(res);
    return json.data || [];
  },

  async getBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${slug}`, { headers: getHeaders() });
    const json = await handleResponse<{ success: boolean; data: Product }>(res);
    return json.data;
  },
};

// ==========================================
// ADMIN PRODUCTS API
// ==========================================
export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  fragrances: number;
  candles: number;
  outOfStock: number;
}

export const adminProductsApi = {
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/admin/products/stats`, {
      headers: getHeaders(true),
    });
    const json = await handleResponse<{ success: boolean; data: DashboardStats }>(res);
    return json.data;
  },

  async getAll(params?: { category?: string; status?: string; search?: string; sort?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    if (params?.sort) query.append("sort", params.sort);

    const queryString = query.toString();
    const url = `${API_BASE}/admin/products${queryString ? `?${queryString}` : ""}`;
    const res = await fetch(url, { headers: getHeaders(true) });
    const json = await handleResponse<{ success: boolean; data: Product[] }>(res);
    return json.data || [];
  },

  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      headers: getHeaders(true),
    });
    const json = await handleResponse<{ success: boolean; data: Product }>(res);
    return json.data;
  },

  async create(productData: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(productData),
    });
    const json = await handleResponse<{ success: boolean; message: string; data: Product }>(res);
    return json.data;
  },

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(productData),
    });
    const json = await handleResponse<{ success: boolean; message: string; data: Product }>(res);
    return json.data;
  },

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  async updateStatus(id: string, status: { isActive?: boolean; featured?: boolean }): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(status),
    });
    const json = await handleResponse<{ success: boolean; data: Product }>(res);
    return json.data;
  },
};
