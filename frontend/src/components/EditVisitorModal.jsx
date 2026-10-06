import React from "react";
import VisitorForm from "./VisitorForm";
import { X, Edit3 } from "lucide-react";

const EditVisitorModal = ({ isOpen, visitor, onUpdate, onClose, isSubmitting }) => {
  if (!isOpen || !visitor) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--primary-50)",
                color: "var(--primary-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Edit3 size={18} />
            </div>
            <div>
              <h3 className="modal-title">Edit Visitor Details</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Update information for {visitor.name}
              </p>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <VisitorForm
            initialData={visitor}
            isEdit={true}
            isSubmitting={isSubmitting}
            onSubmit={(formData) => onUpdate(visitor._id, formData)}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default EditVisitorModal;
