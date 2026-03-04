import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axiosClient, { tokenService } from '@/api/axiosClient';
import type { User, SignInRequest, SignUpRequest } from '@/type/auth';
import { AuthContext } from '@/context/AuthContextValue';
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getAcess();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axiosClient.get<{
          success: boolean;
          data: User;
        }>('/auth/me');
        console.log('me response:', data);
        setUser(data.data);
        console.log('user set:', data.data);
      } catch {
        try {
          const { data } = await axiosClient.post<{
            success: boolean;
            acessToken: string;
          }>('/auth/token/refresh');
          tokenService.setToken(data.acessToken);

          const { data: meData } = await axiosClient.get<{
            success: boolean;
            data: User;
          }>('/auth/me');
          setUser(meData.data);
        } catch {
          tokenService.clear();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const sendEmailVerification = useCallback(async () => {
    await axiosClient.post('/auth/email-verification');
  }, []);
  const signIn = useCallback(async (credentials: SignInRequest) => {
    const { data } = await axiosClient.post<{
      success: boolean;
      acessToken: string;
      user: User;
    }>('/auth/login', credentials);
    if (data.success) {
      setUser(data.user);
      tokenService.setToken(data.acessToken);
    }
  }, []);
  const signup = useCallback(async (credentials: SignUpRequest) => {
    const { data } = await axiosClient.post<{ success: boolean; data: User }>(
      '/auth/register',
      credentials
    );
    if (data.success) {
      setUser(data.data); // ← setUser luôn
    }
  }, []);
  const logout = useCallback(async () => {
    try {
      await axiosClient.post('auth/logout');
    } catch (error) {
      void error;
    }
    tokenService.clear();
    setUser(null);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
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
