// This file is kept for backward compatibility but now delegates to Supabase auth.
// All auth logic lives in AuthContext. This is a no-op stub.

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

// Stub - actual auth uses useAuth() from AuthContext
class AuthService {
  async register(_credentials: RegisterCredentials): Promise<AuthResponse> {
    throw new Error("Use useAuth().signUp() instead");
  }
  async login(_credentials: LoginCredentials): Promise<AuthResponse> {
    throw new Error("Use useAuth().signIn() instead");
  }
  async forgotPassword(_email: string): Promise<{ message: string }> {
    throw new Error("Use useAuth().resetPassword() instead");
  }
  logout() {}
  isAuthenticated() { return false; }
  getToken() { return null; }
}

export const authService = new AuthService();
