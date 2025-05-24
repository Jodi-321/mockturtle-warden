/**
 * authService.ts
 * 
 * Utility functions for managing authentication tokens in localStorage.
 * Keeps token access centralized and consistent.
 */

import { jwtDecode } from 'jwt-decode';
import { AuthToken } from '../types/AuthToken';

const ACCESS_TOKEN_KEY = 'access_token';
const TOKEN_TYPE_KEY = 'token_type';

/**
 * Save JWT token and its type to localStorage
 */
export function storeAuthToken(token: string, type: string = 'bearer'): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TYPE_KEY, type);
}

/**
 * Checks if the token is expired based on the `exp` claim
 */
export function isTokenExpired(token: string):boolean {
    try {
        const decoded: AuthToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;
    } catch (e) {
        return true; // Treat invalid tokens as expired
    }
}

/**
 * Get the token from localStorage
 */
export function getAuthToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const type = localStorage.getItem(TOKEN_TYPE_KEY) || 'bearer';
  return token ? `${type} ${token}` : null;
}

/**
 * Remove token from localStorage
 */
export function clearAuthToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
}

/**
 * Clears the stored token and redirects to login
 */
export function logout(): void {
    clearAuthToken();
    window.location.href = '/login';  // Redirect to login page
}
