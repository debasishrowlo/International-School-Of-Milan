import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Types
interface User {
  id: string;
  role: string;
  username: string;
  firstLogin: boolean;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  token?: string;
}

interface SetUserPayload {
  user: User;
  isLoggedIn: boolean;
  token: string;
}

// Constants
const USER_STORAGE_KEY = 'user';
const IS_LOGGED_IN_COOKIE = 'isLoggedIn';
const TOKEN_COOKIE = 'token';

// Utility functions
const getTokenFromCookies = (): string | null => {
  return Cookies.get(TOKEN_COOKIE) || null;
};

const getUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const clearAuthData = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  Cookies.remove(IS_LOGGED_IN_COOKIE);
  Cookies.remove(TOKEN_COOKIE);
};

// Initial state function
const getInitialState = (): AuthState => {
  const token = getTokenFromCookies();

  // If no token exists, ensure a clean state
  if (!token) {
    clearAuthData();
    return {
      user: null,
      isLoggedIn: false,
    };
  }

  // If token exists, try to get user data
  const user = getUserFromStorage();
  const isLoggedIn = Boolean(Cookies.get(IS_LOGGED_IN_COOKIE));

  return {
    user,
    isLoggedIn: isLoggedIn && !!user // Only consider logged in if both user data and cookie exist
  };
};

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const { user, isLoggedIn, token } = action.payload;

      // Update state
      state.user = user;
      state.isLoggedIn = isLoggedIn;
      state.token = token;

      // Persist data
      if (user && isLoggedIn) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        Cookies.set(IS_LOGGED_IN_COOKIE, 'true', { secure: true, sameSite: 'lax' });
        //Cookies.set(TOKEN_COOKIE, token, { secure: true, sameSite: 'lax' });

      } else {
        clearAuthData();
      }
    },

    logout: (state) => {
      // Clear state
      state.user = null;
      state.isLoggedIn = false;

      // Clear persisted data
      clearAuthData();
    },

    // Add a reducer to handle token expiration or invalid token scenarios
    handleInvalidToken: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      clearAuthData();
    }
  }
});

// Export actions and reducer
export const { setUser, logout, handleInvalidToken } = authSlice.actions;
export default authSlice.reducer;

// Type exports
export type { User, AuthState };
