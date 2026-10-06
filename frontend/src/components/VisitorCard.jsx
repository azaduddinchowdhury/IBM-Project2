import React from "react";
import { formatDateTime } from "../utils/formatters";
import { Phone, Mail, Building, User, Calendar, Edit2, Trash2, LogIn, LogOut } from "lucide-react";

const VisitorCard = ({ visitor, onEdit, onDelete, onToggleStatus, statusLoadingId }) => {
  const isCheckedIn = visitor.status === "Checked In";
  const isUpdatingStatus = statusLoadingId === visitor._id;

  return (
    <div className="visitor-card">
      <div className="card-header">
        <div className="visitor-name-cell">
          <div className="avatar-bubble">
            {visitor.name ? visitor.name.charAt(0).toUpperCase() : "V"}
          </div>
          <div>
            <div className="visitor-primary">{visitor.name}</div>
            <div className="visitor-secondary" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Building size={12} />
              <span>{visitor.organization}</span>
            </div>
          </div>
        </div>

        <span className={`status-badge ${isCheckedIn ? "checked-in" : "checked-out"}`}>
          <span className="dot" />
          {visitor.status}
        </span>
      </div>

      <div className="card-body">
        <div className="card-row">
          <span>Contact:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <Phone size={13} color="var(--primary-600)" />
            {visitor.mobileNumber}
          </span>
        </div>

        <div className="card-row">
          <span>Email:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Mail size={13} color="var(--text-muted)" />
            {visitor.email}
          </span>
        </div>

        <div className="card-row">
          <span>Person to Meet:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <User size={13} color="var(--text-muted)" />
            {visitor.personToMeet}
          </span>
        </div>

        <div className="card-row">
          <span>Purpose:</span>
          <span style={{ maxWidth: "60%", textAlign: "right" }}>{visitor.purposeOfVisit}</span>
        </div>

        <div className="card-row">
          <span>Visit Date & Time:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={13} color="var(--text-muted)" />
            {formatDateTime(visitor.visitDateTime)}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="btn btn-secondary btn-icon status-toggle"
          title={isCheckedIn ? "Mark as Checked Out" : "Mark as Checked In"}
          onClick={() => onToggleStatus(visitor)}
          disabled={isUpdatingStatus}
        >
          {isCheckedIn ? <LogOut size={16} /> : <LogIn size={16} />}
          <span style={{ fontSize: "0.78rem", fontWeight: 600, marginLeft: 4 }}>
            {isCheckedIn ? "Check Out" : "Check In"}
          </span>
        </button>

        <button
          className="btn-icon edit"
          title="Edit Visitor"
          onClick={() => onEdit(visitor)}
        >
          <Edit2 size={16} />
        </button>

        <button
          className="btn-icon delete"
          title="Delete Visitor"
          onClick={() => onDelete(visitor)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default VisitorCard;
