import React from "react";
import { Users, UserCheck, UserMinus, CalendarDays, ArrowRight, UserPlus, Clock } from "lucide-react";
import VisitorTable from "../components/VisitorTable";
import { isToday } from "../utils/formatters";

const Dashboard = ({
  visitors,
  isLoading,
  onNavigateTab,
  onEdit,
  onDelete,
  onToggleStatus,
  statusLoadingId,
}) => {
  // Compute dynamic stats from actual visitor records
  const totalVisitors = visitors.length;
  const checkedInCount = visitors.filter((v) => v.status === "Checked In").length;
  const checkedOutCount = visitors.filter((v) => v.status === "Checked Out").length;
  const todayVisitorsCount = visitors.filter((v) => isToday(v.visitDateTime)).length;

  // Recent visitors (first 5 records)
  const recentVisitors = visitors.slice(0, 5);

  return (
    <div>
      {/* Metric Summary Cards */}
      <div className="metrics-grid">
        <div className="metric-card total">
          <div className="metric-info">
            <h3>Total Visitors</h3>
            <div className="metric-number">{isLoading ? "--" : totalVisitors}</div>
            <div className="metric-sub">All logged entries</div>
          </div>
          <div className="metric-icon-wrap">
            <Users size={24} />
          </div>
        </div>

        <div className="metric-card checked-in">
          <div className="metric-info">
            <h3>Checked In</h3>
            <div className="metric-number">{isLoading ? "--" : checkedInCount}</div>
            <div className="metric-sub">Currently on premises</div>
          </div>
          <div className="metric-icon-wrap">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="metric-card checked-out">
          <div className="metric-info">
            <h3>Checked Out</h3>
            <div className="metric-number">{isLoading ? "--" : checkedOutCount}</div>
            <div className="metric-sub">Departed guests</div>
          </div>
          <div className="metric-icon-wrap">
            <UserMinus size={24} />
          </div>
        </div>

        <div className="metric-card today">
          <div className="metric-info">
            <h3>Today's Visitors</h3>
            <div className="metric-number">{isLoading ? "--" : todayVisitorsCount}</div>
            <div className="metric-sub">Registered today</div>
          </div>
          <div className="metric-icon-wrap">
            <CalendarDays size={24} />
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "var(--shadow-md)",
          marginBottom: 32,
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 4 }}>
            Fast Visitor Registration
          </h2>
          <p style={{ fontSize: "0.86rem", color: "#94a3b8" }}>
            Quickly check in clients, interviewees, vendors, and guests at the reception.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn btn-primary"
            onClick={() => onNavigateTab("add-visitor")}
          >
            <UserPlus size={16} />
            <span>Add Visitor</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigateTab("visitors")}
            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.15)" }}
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Recent Visitors Section */}
      <div className="section-card">
        <div className="section-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={18} color="var(--primary-600)" />
            <h2 className="section-title">Recent Visitor Activity</h2>
          </div>
          <button
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
            onClick={() => onNavigateTab("visitors")}
          >
            View All ({totalVisitors})
          </button>
        </div>

        <VisitorTable
          visitors={recentVisitors}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          statusLoadingId={statusLoadingId}
          onAddNew={() => onNavigateTab("add-visitor")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
