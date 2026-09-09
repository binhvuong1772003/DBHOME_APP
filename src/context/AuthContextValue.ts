import { createContext } from "react";
import type { User, SignInRequest, SignUpRequest } from "@/type/auth";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // ← thêm
  signIn: (data: SignInRequest) => Promise<User | null>;
  signup: (data: SignUpRequest) => Promise<void>;
  /** Clears the local session even when the server request fails. */
  logout: () => Promise<boolean>;
  sendEmailVerification: (email: string) => Promise<void>;
  connectionError: boolean; // ← thêm
  retryAuth: () => Promise<void>; // ← thêm
};

export const AuthContext = createContext<AuthContextType | null>(null);
