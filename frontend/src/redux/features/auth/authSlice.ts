import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cookies from 'js-cookie';

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
}

// Constants
const USER_STORAGE_KEY = 'user';
const TOKEN_COOKIE = 'token';

// Utility functions
const getTokenFromCookies = (): string | null => {
  return cookies.get(TOKEN_COOKIE) || null;
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
  cookies.remove("isLoggedIn");
};

// Initial state function
const getInitialState = (): AuthState => {
  return {
    user: null,
    isLoggedIn: cookies.get("isLoggedIn") !== undefined,
  }
};

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const { isLoggedIn } = action.payload;
      state.isLoggedIn = isLoggedIn;
    },

    logout: (state) => {
      // Clear state
      state.user = null;
      state.isLoggedIn = false;

      // Clear persisted data
      clearAuthData();
    },

    handleInvalidToken: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      clearAuthData();
    },
  }
});

// Export actions and reducer
export const { setUser, logout, handleInvalidToken } = authSlice.actions;
export default authSlice.reducer;

// Type exports
export type { User, AuthState };
