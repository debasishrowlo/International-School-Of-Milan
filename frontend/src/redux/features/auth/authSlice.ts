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

const clearAuthData = () => {
  cookies.remove("isLoggedIn");
  localStorage.removeItem("user")
};

// Initial state function
const getInitialState = (): AuthState => {
  const initialState = {
    user: null,
    isLoggedIn: false,
  }

  const isLoggedIn = cookies.get("isLoggedIn") !== undefined
  if (isLoggedIn) {
    const userData = localStorage.getItem("user")

    if (userData) {
      initialState.user = JSON.parse(userData)
      initialState.isLoggedIn = true
    }
  }

  return initialState
};

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const { user, isLoggedIn } = action.payload;
      state.user = user
      state.isLoggedIn = isLoggedIn;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      clearAuthData();
    },
  }
});

// Export actions and reducer
export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

// Type exports
export type { User, AuthState };
