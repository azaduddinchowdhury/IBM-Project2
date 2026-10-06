import React, { useState, useEffect } from "react";
import { Menu, ShieldCheck, Clock, LogOut, User } from "lucide-react";

const Navbar = ({ activeTab, onToggleSidebar, currentUser, onLogout }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "visitors":
        return "Visitor Records";
      case "add-visitor":
        return "Register New Visitor";
      default:
        return "Visitor Management";
    }
  };

  const getRoleDisplayName = (role) => {
    if (!role) return "Staff";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        <div className="current-time-pill">
          <Clock size={15} />
          <span>{currentTime}</span>
        </div>

        <div className="system-badge" title={currentUser?.email || "Authenticated user"}>
          <ShieldCheck size={16} />
          <span>
            {currentUser?.name
              ? `${currentUser.name} (${getRoleDisplayName(currentUser.role)})`
              : "Reception Desk"}
          </span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="btn-logout"
            title="Sign out of system"
            aria-label="Sign out"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
