import React, { useState, useMemo } from "react";
import { Search, UserPlus, Filter, RefreshCw } from "lucide-react";
import VisitorTable from "../components/VisitorTable";

const Visitors = ({
  visitors,
  isLoading,
  onRefresh,
  onNavigateTab,
  onEdit,
  onDelete,
  onToggleStatus,
  statusLoadingId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filter visitors using instant client-side filtering
  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) => {
      // Status Filter
      if (statusFilter !== "ALL" && visitor.status !== statusFilter) {
        return false;
      }

      // Search Query Filter (by name or mobileNumber, case-insensitive)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const nameMatch = visitor.name?.toLowerCase().includes(query);
        const mobileMatch = visitor.mobileNumber?.toLowerCase().includes(query);
        const orgMatch = visitor.organization?.toLowerCase().includes(query);
        const personMatch = visitor.personToMeet?.toLowerCase().includes(query);

        return nameMatch || mobileMatch || orgMatch || personMatch;
      }

      return true;
    });
  }, [visitors, searchQuery, statusFilter]);

  return (
    <div>
      {/* Action Header: Search & Filter */}
      <div className="action-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="ALL">All Statuses</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
            </select>
          </div>

          <button
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            title="Refresh visitor list"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "spinner" : ""} />
          </button>

          <button
            className="btn btn-primary"
            onClick={() => onNavigateTab("add-visitor")}
          >
            <UserPlus size={16} />
            <span>Add Visitor</span>
          </button>
        </div>
      </div>

      {/* Visitor Records Listing */}
      <VisitorTable
        visitors={filteredVisitors}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        statusLoadingId={statusLoadingId}
        onAddNew={() => onNavigateTab("add-visitor")}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default Visitors;
