//@ts-nocheck
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/Layout';
import AuthGuard from '@/router/AuthGuard';

import App from "@/App"

// Page imports
import Home from '@/pages/home/Home';
import Post from '@/pages/Post';
import Posts from '@/pages/Posts';
import Announcements from '@/pages/Announcements';
import Login from '@/pages/user/Login';
import Activities from '@/pages/Activities';
import Activity from '@/pages/Activity';
import ResetPassword from '@/pages/resetPassword';

// Dashboard imports
import AdminLayout from '@/pages/dashboard/AdminLayout';
import Dashboard from '@/pages/dashboard/Dashboard';
import ManageItems from '@/pages/dashboard/post/ManageItems';
import ManageUsers from '@/pages/dashboard/user/ManageUsers';
import DashboardPosts from '@/pages/dashboard/Posts';
import DashboardActivity from '@/pages/dashboard/Activity';
import Cas from '@/pages/dashboard/activities/underpages/CAS/cas';

// Types
import { Activity as TActivity, Post as TPost } from '@/types';

// Route definitions
export const routes = {
  // Public routes
  home: '/',
  login: '/login',
  resetPassword: '/reset-password',

  // Content routes
  news: '/news',
  singleNews: '/news/:id',
  announcements: '/announcements',

  activities: '/activities/:type',
  activity: '/activity/:id',

  // Dashboard routes
  dashboard: '/dashboard',
  dashboard_manageItems: '/dashboard/manage-items',
  dashboard_users: '/dashboard/users',
  dashboard_news_list: '/dashboard/news',
  dashboard_activity: '/dashboard/activities/:slug',
};

// API route definitions
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const apiRoutes = {
  bulkCreateUsers: `${backendUrl}/auth/multiRegisterRoute`,

  users: {
    list: `${backendUrl}/auth/users`,
    delete: (id:string) => `${backendUrl}/auth/users/${id}`,
  },

  posts: {
    comments: {
      list: (postId: string) => `${backendUrl}/posts/${postId}/comments`,
      create: (postId: string) => `${backendUrl}/posts/${postId}/comments`,
    },
  },

  // Posts
  getPosts: `${backendUrl}/posts`,
  createPost: `${backendUrl}/posts`,
  findPost: (postId: string) => `${backendUrl}/posts/${postId}`,
  updatePost: (post: TPost) => `${backendUrl}/posts/${post.id}`,
  deletePost: (post: TPost) => `${backendUrl}/posts/${post.id}`,
  getRelatedPosts: (id: string) => `${backendUrl}/posts/related/${id}`,

  // CAS
  fineCasPost: (postId: string) => `${backendUrl}/cas/${postId}`,
  createActivity: `${backendUrl}/posts`,

  // Activities
  updateActivity: (activityId: string) => `${backendUrl}/activities/${activityId}`,
  deleteActivity: (activity: TActivity) => `${backendUrl}/activities/${activity.id}`,
};

// Route helper functions
export const createSingleNewsRoute = (id: string) => routes.singleNews.replace(':id', id);
export const createActivityRoute = (id: string) => routes.activity.replace(':id', id)
export const createActivitiesRoute = (type: string) => routes.activities.replace(':type', type);
export const createDashboardActivityRoute = (slug: string) => routes.dashboard_activity.replace(':slug', slug);

// Auth wrapper component
const AuthProtectedLayout = () => (
  <AuthGuard>
    <Layout />
  </AuthGuard>
);

// Router configuration
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <AuthProtectedLayout />,
        children: [
          { path: routes.home, element: <Home /> },
          { path: routes.announcements, element: <Announcements /> },
          { path: routes.activities, element: <Activities /> },
          { path: routes.activity, element: <Activity /> },
          { path: routes.news, element: <Posts /> },
          { path: routes.singleNews, element: <Post /> },
        ],
      },
      {
        element: <Layout />,
        children: [
          { path: routes.login, element: <Login /> },
          { path: routes.resetPassword, element: <ResetPassword /> },
        ],
      },
      // Protected dashboard routes
      {
        element: <AuthProtectedLayout />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: routes.dashboard, element: <Dashboard /> },
              { path: routes.dashboard_manageItems, element: <ManageItems /> },
              { path: routes.dashboard_users, element: <ManageUsers /> },
              { path: routes.dashboard_news_list, element: <DashboardPosts /> },
              { path: routes.dashboard_activity, element: <DashboardActivity /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
