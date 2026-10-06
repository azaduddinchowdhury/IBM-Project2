import React from "react";
import { LayoutDashboard, Users, UserPlus, Building2, X } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "visitors",
      label: "Visitors",
      icon: Users,
    },
    {
      id: "add-visitor",
      label: "Add Visitor",
      icon: UserPlus,
    },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 35 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-icon">
            <Building2 size={22} />
          </div>
          <div className="brand-text">
            <h1>VisitorDesk</h1>
            <span>Employee System</span>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="btn-icon"
              style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#94a3b8" }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleSelectTab(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>System Active</span>
          </div>
          <span>v1.0</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
