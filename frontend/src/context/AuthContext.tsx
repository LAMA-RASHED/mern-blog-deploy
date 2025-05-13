import axios from 'axios';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useContext } from 'react';
import { toast } from 'react-toastify';

interface IAuthContext {
  register: (
    userData: IUser,
    navigate: (path: string) => void
  ) => Promise<void>;
  userInfo: ICurrentUser | null;
  login: (
    userData: IUserLogin,
    navigate: (path: string) => void
  ) => Promise<void>;
  logout: (navigate: (path: string) => void) => Promise<void>;
  updateUser: (userData: IUser, message: string) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    password: string,
    message: string
  ) => Promise<void>;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

//const baseUrl = 'https://33000.fullstack.clarusway.com';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  // Initialize the state from localStorage if available
  const [userInfo, setUserInfo] = useState<ICurrentUser | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Effect to update localStorage whenever userInfo changes
  useEffect(() => {
    if (userInfo) {
      // Save user information in localStorage when available
      localStorage.setItem('user', JSON.stringify(userInfo));
    } else {
      // Clear localStorage when userInfo is null (user logged out)
      localStorage.removeItem('user');
    }
  }, [userInfo]);

  // Check authentication when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !userInfo) {
      setUserInfo(JSON.parse(storedUser)); // Restore userInfo from localStorage if available
    }
    // Alternatively, perform an async token validation with the server here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function checkAuth() {
  //   if (userInfo) {
  //     // add user information to localStorage
  //     localStorage.setItem('user', JSON.stringify(userInfo));
  //   } else {
  //     // retrieve it from localStorage
  //     const user = localStorage.getItem('user');
  //     if (user) setUserInfo(JSON.parse(user));
  //   }
  // }

  const register = async (
    userData: IUser,
    navigate: (path: string) => void
  ) => {
    // Map frontend field names to backend field names
    const mappedUserData = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      username: userData.username,
      password: userData.password,
    };

    try {
      const { data } = await axios.post<{ token: string; user: ICurrentUser }>(
        `${baseUrl}/account/register`,
        mappedUserData
      );
      setUserInfo({ ...data.user, token: data.token });
      toast.success('User registered successfully!');
      navigate('/');
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const login = async (
    userData: IUserLogin,
    navigate: (path: string) => void
  ) => {
    try {
      const { data } = await axios.post<{ token: string; user: ICurrentUser }>(
        `${baseUrl}/account/login`,
        userData
      );
      setUserInfo({ ...data.user, token: data.token });
      toast.success('User logged in successfully!');
      navigate('/');
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const logout = async (navigate: (path: string) => void) => {
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).token;
      try {
        await axios({
          method: 'get',
          url: `${baseUrl}/account/logout`,
          headers: { Authorization: `Token ${token}` },
        });

        toast.success('Logged out successfully');
        localStorage.removeItem('user');
        setUserInfo(null);
        navigate('/auth/login');
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  };

  const updateUser = async (userData: IUser, message: string) => {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;

    try {
      const { data } = await axios({
        method: 'put',
        url: `${baseUrl}/users/${userData._id}`,
        headers: { Authorization: `Token ${token}` },
        data: {
          ...userData,
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      });

      setUserInfo({ ...userInfo, ...data.data });
      toast.success(message);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const updatePassword = async (
    currentPassword: string,
    password: string,
    message: string
  ) => {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    try {
      await axios({
        method: 'put',
        url: `${baseUrl}/account/password/`,
        headers: { Authorization: `Token ${token}` },
        data: { currentPassword, newPassword: password },
      });
      toast.success(message);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ register, login, logout, userInfo, updateUser, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
