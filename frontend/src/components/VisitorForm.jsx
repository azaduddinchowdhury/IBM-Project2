import React, { useState, useEffect } from "react";
import { toDateTimeLocal } from "../utils/formatters";
import { AlertCircle, CheckCircle, User, Phone, Mail, Building, UserCheck, FileText, Calendar } from "lucide-react";

const initialFormState = {
  name: "",
  mobileNumber: "",
  email: "",
  organization: "",
  personToMeet: "",
  purposeOfVisit: "",
  visitDateTime: toDateTimeLocal(new Date()),
  status: "Checked In",
};

const VisitorForm = ({ initialData, onSubmit, onCancel, isSubmitting, isEdit = false }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        mobileNumber: initialData.mobileNumber || "",
        email: initialData.email || "",
        organization: initialData.organization || "",
        personToMeet: initialData.personToMeet || "",
        purposeOfVisit: initialData.purposeOfVisit || "",
        visitDateTime: toDateTimeLocal(initialData.visitDateTime),
        status: initialData.status || "Checked In",
      });
    } else {
      setFormData({
        ...initialFormState,
        visitDateTime: toDateTimeLocal(new Date()),
      });
    }
  }, [initialData]);

  // Validation function
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Visitor name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;

      case "mobileNumber":
        if (!value.trim()) {
          error = "Mobile number is required";
        } else if (!/^[0-9+() -]{7,15}$/.test(value.trim())) {
          error = "Enter a valid mobile number (7-15 digits)";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;

      case "organization":
        if (!value.trim()) {
          error = "Organization or College name is required";
        }
        break;

      case "personToMeet":
        if (!value.trim()) {
          error = "Person to meet is required";
        }
        break;

      case "purposeOfVisit":
        if (!value.trim()) {
          error = "Purpose of visit is required";
        }
        break;

      case "visitDateTime":
        if (!value) {
          error = "Visit date and time is required";
        }
        break;

      case "status":
        if (!value) {
          error = "Status is required";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validateAll()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {/* Visitor Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            <User size={15} />
            Visitor Name <span className="required-star">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name && touched.name ? "error" : ""}`}
            placeholder="Enter visitor name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          {errors.name && touched.name && (
            <span className="error-msg">
              <AlertCircle size={13} /> {errors.name}
            </span>
          )}
        </div>

        {/* Mobile Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="mobileNumber">
            <Phone size={15} />
            Mobile Number <span className="required-star">*</span>
          </label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            className={`form-input ${errors.mobileNumber && touched.mobileNumber ? "error" : ""}`}
            placeholder="Enter mobile number (e.g. 9876543210)"
            value={formData.mobileNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          {errors.mobileNumber && touched.mobileNumber && (
            <span className="error-msg">
              <AlertCircle size={13} /> {errors.mobileNumber}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            <Mail size={15} />
            Email Address <span className="required-star">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${errors.email && touched.email ? "error" : ""}`}
            placeholder="Enter email address (e.g. guest@example.com)"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          {errors.email && touched.email && (
            <span className="error-msg">
              <AlertCircle size={13} /> {errors.email}
            </span>
          )}
        </div>

        {/* Organization / College */}
        <div className="form-group">
          <label className="form-label" htmlFor="organization">
            <Building size={15} />
            Organization / College <span className="required-star">*</span>
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            className={`form-input ${errors.organization && touched.organization ? "error" : ""}`}
            placeholder="Enter organization or college name"
            value={formData.organization}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          {errors.organization && touched.organization && (
            <span className="error-msg">
              <AlertCircle size={13} /> {errors.organization}
            </span>
          )}
        </div>

        {/* Person to Meet */}
        <div className="form-group">
          <label className="form-label" htmlFor="personToMeet">
            <UserCheck size={15} />
            Person to Meet <span className="required-star">*</span>
          </label>
          <input
            id="personToMeet"
            name="personToMeet"
            type="text"
            className={`form-input ${errors.personToMeet && touched.personToMeet ? "error" : ""}`}
            placeholder="Enter employee / host name"
            value={formData.personToMeet}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          {errors.personToMeet && touched.personToMeet && (
            <span className="error-msg">
              <AlertCircle size={13} /> {errors.personToMeet}
            </span>
          )}
        </div>

        {/* Date & Time */}
        <div className="form-group">
          <label className="form-label" htmlFor="visitDateTime">
            <Calendar size={15} />
            Date and Time <span className="required-star">*</span>
          </label>
          <input
            id="visitDateTime"
            name="visitDateTime"
            type="datetime-local"
            className={`form-input ${errors.visitDateTime && touched.visitDateTime ? "error" : ""}`}
            value={formData.visitDateTime}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          {errors.visitDateTime && touched.visitDateTime && (
            <span className="error-msg">
              <AlertCircle size={13} /> {errors.visitDateTime}
            </span>
          )}
        </div>

        {/* Purpose of Visit */}
        <div className="form-group full-width">
          <label className="form-label" htmlFor="purposeOfVisit">
            <FileText size={15} />
            Purpose of Visit <span className="required-star">*</span>
          </label>
          <input
            id="purposeOfVisit"
            name="purposeOfVisit"
            type="text"
            className={`form-input ${errors.purposeOfVisit && touched.purposeOfVisit ? "error" : ""}`}
            placeholder="Enter purpose (e.g. Interview, Business Meeting, Campus Visit, Vendor Delivery)"
            value={formData.purposeOfVisit}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          {errors.purposeOfVisit && touched.purposeOfVisit && (
            <span className="error-msg">
              <AlertCircle size={13} /> {errors.purposeOfVisit}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="form-group full-width">
          <label className="form-label" htmlFor="status">
            Status <span className="required-star">*</span>
          </label>
          <select
            id="status"
            name="status"
            className={`form-select ${errors.status && touched.status ? "error" : ""}`}
            value={formData.status}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          >
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
          </select>
          {errors.status && touched.status && (
            <span className="error-msg">
              <AlertCircle size={13} /> {errors.status}
            </span>
          )}
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Adding visitor..."
            : isEdit
            ? "Update Visitor"
            : "Add Visitor"}
        </button>
      </div>
    </form>
  );
};

export default VisitorForm;
