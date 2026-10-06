import React from "react";
import { formatDateTime } from "../utils/formatters";
import VisitorCard from "./VisitorCard";
import {
  Edit2,
  Trash2,
  LogIn,
  LogOut,
  UserX,
  UserPlus,
  Phone,
  Mail,
  Building,
} from "lucide-react";

const VisitorTable = ({
  visitors,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  statusLoadingId,
  onAddNew,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <div className="table-card">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading visitors...</p>
        </div>
      </div>
    );
  }

  if (!visitors || visitors.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <UserX size={32} />
          </div>
          <h3>{searchQuery ? "No matching visitors found" : "No visitors found"}</h3>
          <p>
            {searchQuery
              ? `No records found matching "${searchQuery}". Try a different name or mobile number.`
              : "No visitor records have been added yet. Click below to register the first visitor."}
          </p>
          {onAddNew && (
            <button className="btn btn-primary" onClick={onAddNew}>
              <UserPlus size={16} />
              <span>Add Visitor</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop & Tablet Table */}
      <div className="table-card table-responsive">
        <table className="visitor-table">
          <thead>
            <tr>
              <th>Visitor</th>
              <th>Contact Info</th>
              <th>Organization</th>
              <th>Person to Meet</th>
              <th>Purpose of Visit</th>
              <th>Visit Date & Time</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => {
              const isCheckedIn = visitor.status === "Checked In";
              const isUpdatingStatus = statusLoadingId === visitor._id;

              return (
                <tr key={visitor._id}>
                  {/* Visitor Avatar & Name */}
                  <td>
                    <div className="visitor-name-cell">
                      <div className="avatar-bubble">
                        {visitor.name ? visitor.name.charAt(0).toUpperCase() : "V"}
                      </div>
                      <div>
                        <div className="visitor-primary">{visitor.name}</div>
                        <div className="visitor-secondary" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Mail size={12} />
                          <span>{visitor.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500, fontSize: "0.85rem" }}>
                      <Phone size={13} color="var(--primary-600)" />
                      <span>{visitor.mobileNumber}</span>
                    </div>
                  </td>

                  {/* Organization */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
                      <Building size={13} color="var(--text-muted)" />
                      <span>{visitor.organization}</span>
                    </div>
                  </td>

                  {/* Person to Meet */}
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--text-sub)", fontSize: "0.85rem" }}>
                      {visitor.personToMeet}
                    </span>
                  </td>

                  {/* Purpose */}
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        maxWidth: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.85rem",
                      }}
                      title={visitor.purposeOfVisit}
                    >
                      {visitor.purposeOfVisit}
                    </span>
                  </td>

                  {/* Visit Date & Time */}
                  <td style={{ whiteSpace: "nowrap", fontSize: "0.82rem", color: "var(--text-sub)" }}>
                    {formatDateTime(visitor.visitDateTime)}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`status-badge ${isCheckedIn ? "checked-in" : "checked-out"}`}>
                      <span className="dot" />
                      {visitor.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="actions-cell" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="btn-icon status-toggle"
                        title={isCheckedIn ? "Mark Checked Out" : "Mark Checked In"}
                        onClick={() => onToggleStatus(visitor)}
                        disabled={isUpdatingStatus}
                        aria-label="Toggle Status"
                      >
                        {isCheckedIn ? <LogOut size={16} /> : <LogIn size={16} />}
                      </button>

                      <button
                        className="btn-icon edit"
                        title="Edit Visitor"
                        onClick={() => onEdit(visitor)}
                        aria-label="Edit Visitor"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        className="btn-icon delete"
                        title="Delete Visitor"
                        onClick={() => onDelete(visitor)}
                        aria-label="Delete Visitor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="mobile-cards-grid">
        {visitors.map((visitor) => (
          <VisitorCard
            key={visitor._id}
            visitor={visitor}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            statusLoadingId={statusLoadingId}
          />
        ))}
      </div>
    </>
  );
};

export default VisitorTable;
