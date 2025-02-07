import { useState } from "react";
import classnames from "classnames";
import AdminImg from "../../assets/admin.jpg";
import { NavLink } from "react-router-dom";
import { useLogoutUserMutation } from "../../redux/features/auth/authapi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { RootState } from '@/redux/store'
import { FaChevronDown as ArrowDownIcon } from "react-icons/fa";

import { routes, createDashboardActivityRoute } from "@/router"
import { navbarActivities } from "@/constants"

const AdminNavigation = () => {
  const [logoutUser] = useLogoutUserMutation();
  const [accordionOpen, setAccordionOpen] = useState(true)

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logoutUser('').unwrap();
      dispatch(logout());
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen)
  }
  if (!(user?.role)) return null;
  return (
    <div className="space-y-20 bg-white p-32 md:h-[calc(100vh-98px)] flex flex-col justify-between">
      <div>
        {/* Header part */}
        <div className="mb-20">
          <img src={AdminImg} alt="" className="size-56" />
          <p className="font-semibold">Admin </p>
        </div>
        <hr />
        <ul className="space-y-20 pt-20">
          {[
            {
              to: routes.dashboard,
              text: "Dashboard",
            },
            ...(user?.role === 'admin' || user?.role === 'moderator' ? [
              {
                to: routes.dashboard_manageItems,
                text: "Manage Items",
              },
              {
                to: routes.dashboard_users,
                text: "Users",
              },
            ] : []),
            {
              to: routes.dashboard_news_list,
              text: "News",
            },
          ].map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  isActive ? "block text-blue-600 font-bold" : "block text-black"
                }
              >
                {link.text}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={toggleAccordion}
              className="w-full flex justify-between items-center"
            >
              <p>Activities</p>
              <ArrowDownIcon className={classnames({
                "-rotate-90": !accordionOpen,
              })} />
            </button>
          </li>
          {accordionOpen && (
            <>
              {navbarActivities.map((activity, index) => (
                <li key={index}>
                  <NavLink
                    to={createDashboardActivityRoute(activity.type)}
                    className={({ isActive }) =>
                      isActive ? "block pl-12 text-blue-600 font-bold" : "block pl-12 text-black"
                    }
                  >
                    {activity.name}
                  </NavLink>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>

      <div className="mb-12">
        <hr className="mb-12"></hr>
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 font-medium px-20 py-4 rounded-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;
