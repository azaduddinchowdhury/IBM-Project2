import React from "react";
import VisitorForm from "../components/VisitorForm";
import { UserPlus } from "lucide-react";

const AddVisitor = ({ onSubmit, onCancel, isSubmitting }) => {
  return (
    <div className="form-card">
      <div className="form-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: "var(--primary-gradient)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserPlus size={20} />
          </div>
          <div>
            <h2>Register New Visitor</h2>
            <p>Fill out the details below to record and check in a new visitor.</p>
          </div>
        </div>
      </div>

      <VisitorForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isEdit={false}
      />
    </div>
  );
};

export default AddVisitor;
