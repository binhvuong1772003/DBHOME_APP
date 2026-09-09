import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { AxiosError } from "axios";
import axiosClient, { tokenService } from "@/api/axiosClient";
import type { User, SignInRequest, SignUpRequest } from "@/type/auth";
import { AuthContext } from "@/context/AuthContextValue";
import type { ApiSuccessResponse } from "@/api/apiResponse";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Distinguishes "we couldn't verify auth because the server is
  // unreachable" from "the user genuinely isn't logged in" — PrivateRoute
  // (or any consumer) can check this instead of treating every null user
  // as a login redirect.
  const [connectionError, setConnectionError] = useState(false);

  const initAuth = useCallback(async () => {
    const token = tokenService.getAccess();

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setConnectionError(false);

    try {
      const { data: response } = await axiosClient.get<ApiSuccessResponse<User>>("/auth/me");
      setUser(response.data);
    } catch (err) {
      const isAuthFailure =
        err instanceof AxiosError &&
        (err.response?.status === 401 || err.response?.status === 403);

      if (isAuthFailure) {
        // Token thật sự sai/hết hạn — đây mới là lúc nên logout.
        tokenService.clear();
        setUser(null);
      } else {
        // Mất mạng, timeout, backend sập... — KHÔNG xoá token, không kết
        // luận là chưa đăng nhập. Giữ nguyên user hiện có (nếu đã từng có)
        // và báo lỗi kết nối riêng để UI có thể hiện "Thử lại" thay vì
        // đá thẳng về trang login.
        setConnectionError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const sendEmailVerification = useCallback(async (email: string) => {
    await axiosClient.post("/auth/email/verification/resend", {
      email,
    });
  }, []);

  const signIn = useCallback(async (credentials: SignInRequest) => {
    const { data: response } = await axiosClient.post<ApiSuccessResponse<{ accessToken: string; user: User }>>("/auth/login", credentials);
    setUser(response.data.user);
    tokenService.setToken(response.data.accessToken);
    return response.data.user;
  }, []);

  const signup = useCallback(async (credentials: SignUpRequest) => {
    const { data: response } = await axiosClient.post<ApiSuccessResponse<User>>(
      "/auth/register",
      credentials,
    );
    setUser(response.data);
  }, []);

  const logout = useCallback(async () => {
    let serverLogoutSucceeded = true;
    try {
      await axiosClient.post("auth/logout");
    } catch {
      // The local session must still be cleared, but callers can surface that
      // the server-side revoke request did not complete.
      serverLogoutSucceeded = false;
    }
    tokenService.clear();
    setUser(null);
    return serverLogoutSucceeded;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        connectionError,
        retryAuth: initAuth,
        signIn,
        signup,
        logout,
        sendEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
