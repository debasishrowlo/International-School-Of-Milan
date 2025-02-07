import { Navigate, Outlet } from "react-router-dom";
import AdminNavigation from '@/pages/dashboard/AdminNavigation'
import { useSelector } from "react-redux";

import { routes } from "@/router"

const AdminLayout = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn || (user && user.role !== "admin" && user.role !== "moderator" && user.role !== 'creator')) {
    return <Navigate to={routes.login} />;
  }

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-16 items-start justify-start">
      <header className="lg:w-1/5 sm:2/5 w-full">
        <AdminNavigation />
      </header>
      <main className="p-32 bg-white w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
