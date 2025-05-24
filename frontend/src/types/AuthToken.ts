/**
 * AuthToken.ts
 * 
 * Defines the expectd structure of a decoded JWT payload
 */

export interface AuthToken {
    sub:string; // Subject (typically the username of user ID)
    exp: number;    // Expiration timestamp (in seconds)
    role?: string;  // Optional role field
    [key: string]: any; // Allow addtional claims
}