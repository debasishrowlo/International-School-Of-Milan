import { configureStore } from '@reduxjs/toolkit';
import { postApi } from './features/posts/PostsApi'; // Ensure correct path and proper API setup
import authApi from './features/auth/authapi'; // Ensure correct path and proper API setup
import authReducer from './features/auth/authSlice'; // Ensure correct path
import commentApi from './features/comments/commentApi';
import casApi from './features/activities/casApi';
import { casResponseApi } from './features/activities/casResponseApi';

export const store = configureStore({
	reducer: {
		// Add the generated reducers from API slices and other slices
		[postApi.reducerPath]: postApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[commentApi.reducerPath]: commentApi.reducer,
		[casApi.reducerPath]: casApi.reducer,
		[casResponseApi.reducerPath]: casResponseApi.reducer,
		auth: authReducer, // Auth slice for managing user state
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(postApi.middleware, authApi.middleware, commentApi.middleware, casApi.middleware, casResponseApi.middleware), // Ensure correct middleware addition
});
export type RootState = ReturnType<typeof store.getState>;
// Optional: Enable caching, invalidation, polling, etc. with API slices
