import React from "react";
import { routes } from "../routes";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-[15vw] min-h-screen flex flex-col bg-gray-900 border-r border-gray-700/30">
      
      <div className="flex p-6 items-center mt-2 justify-center w-full">
        <div className="w-full h-[5vw] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex justify-center items-center">
        </div>
      </div>

      <nav className="space-y-1 px-4">
        {routes.map((route, index) => (
          <Link
            key={index}
            to={route.path}
            className={`
              flex items-center space-x-3 p-2 rounded-md transition-all duration-300
              ${
                location.pathname === route.path
                  ? "bg-purple-600/20 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <span
              className={`
              ${
                location.pathname === route.path
                  ? "text-purple-500"
                  : "text-gray-500 group-hover:text-white"
              }
            `}
            >
              {route.icon}
            </span>
            <span className="text-sm">{route.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
