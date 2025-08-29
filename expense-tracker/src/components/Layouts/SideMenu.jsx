// src/components/Layouts/SideMenu.jsx

import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../Cards/CharAvatar";
import { LuLogOut } from "react-icons/lu";        // ← use the installed icon

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div
      className="
        w-64
        h-[calc(100vh-61px)]
        bg-white
        border-r border-gray-200/50
        p-5
        sticky top-[61px] z-20
        flex flex-col                     {/* full-height column flex */}
      "
    >
      {/* Profile */}
      <div className="flex flex-col items-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        ) : (
          <CharAvatar
            fullName={user.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}
        <h5 className="text-gray-950 font-medium leading-6">
          {user.fullName}
        </h5>
      </div>

      {/* Navigation items */}
      <nav className="flex flex-col space-y-3">
        {SIDE_MENU_DATA.map((item, idx) => (
          <button
            key={idx}
            className={`
              w-full flex items-center gap-4 text-[15px]
              py-3 px-6 rounded-lg
              ${activeMenu === item.label ? "text-white bg-primary" : ""}
            `}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout pinned to bottom */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-4
            py-3 px-6 rounded-lg
            text-red-600 hover:text-red-800
          "
        >
          <LuLogOut className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
