// src/type/auth.ts
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isVerified: boolean; // ← thêm
  role: string;
};

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
