/**
 * 🌐 Configurações da aplicação
 */

// 🌍 Base URL para APIs internas (BFF)
export const API_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Endpoints da API
export const API_ENDPOINTS = {
  CATEGORIES: "/api/categories",
  PRODUCTS: "/api/products",
};
