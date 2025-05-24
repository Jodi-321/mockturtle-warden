/**
 * 
 * 
 * Wrapper for fetch API that automatically includes Authorization headers
 * Dynamically uses the API base URL from environment config
 */

import { getAuthToken } from './authService';

// Load base URL from env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Sends a POST request to a secured backend endpoint wiht JWT
 */
export async function postWithAuth<TRequest, TResponse>(
    url: string,
    body: TRequest
): Promise<TResponse> {
    const token = getAuthToken();

    if(!token){
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if(!response.ok){
        let errorDetail = 'Request failed.';

        try {
            const errorData = await response.json();
            errorDetail = errorData?.detail || errorDetail;
        } catch {

        }
        
        throw new Error(errorDetail);
    }

    return await response.json();
}