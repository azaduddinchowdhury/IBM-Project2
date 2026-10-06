import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ConfirmModal from "./components/ConfirmModal";
import EditVisitorModal from "./components/EditVisitorModal";
import Dashboard from "./pages/Dashboard";
import Visitors from "./pages/Visitors";
import AddVisitor from "./pages/AddVisitor";
import Login from "./pages/Login";
import { visitorApi, authApi } from "./api/axios";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

function App() {
  // Helper to read initial stored user
  const getInitialUser = () => {
    try {
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("token") || sessionStorage.getItem("token"));
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    showAlert("Signed in successfully. Welcome back!", "success");
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setCurrentUser(null);
      setIsLoggedIn(false);
      showAlert("You have been signed out.", "info");
    }
  };

  // Verify stored session with backend on load
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data?.success && res.data.user) {
            setCurrentUser(res.data.user);
            setIsLoggedIn(true);
          }
        } catch {
          // Token is expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      }
    };
    verifySession();
  }, []);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modals state
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [deletingVisitor, setDeletingVisitor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alerts
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch all visitors from backend
  const fetchVisitors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await visitorApi.getAll();
      if (response.data && response.data.success) {
        setVisitors(response.data.data || []);
      } else {
        setVisitors(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching visitors:", err);
      showAlert(
        err.response?.data?.message || "Unable to load visitors. Please check the server.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchVisitors();
    }
  }, [isLoggedIn, fetchVisitors]);

  // Add Visitor
  const handleCreateVisitor = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await visitorApi.create(formData);
      if (response.data?.success) {
        showAlert("Visitor added successfully.", "success");
        await fetchVisitors();
        setActiveTab("visitors");
      }
    } catch (err) {
      console.error("Create visitor failed:", err);
      showAlert(
        err.response?.data?.message || "Failed to create visitor. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Visitor
  const handleUpdateVisitor = async (id, formData) => {
    setIsSubmitting(true);
    try {
      const response = await visitorApi.update(id, formData);
      if (response.data?.success) {
        showAlert("Visitor updated successfully.", "success");
        setVisitors((prev) =>
          prev.map((v) => (v._id === id ? response.data.data : v))
        );
        setEditingVisitor(null);
      }
    } catch (err) {
      console.error("Update visitor failed:", err);
      showAlert(
        err.response?.data?.message || "Failed to update visitor. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Check In / Check Out Status
  const handleToggleStatus = async (visitor) => {
    const nextStatus = visitor.status === "Checked In" ? "Checked Out" : "Checked In";
    setStatusLoadingId(visitor._id);

    try {
      const response = await visitorApi.updateStatus(visitor._id, nextStatus);
      if (response.data?.success) {
        setVisitors((prev) =>
          prev.map((v) => (v._id === visitor._id ? response.data.data : v))
        );
        showAlert(`Visitor marked as ${nextStatus}.`, "success");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      showAlert(
        err.response?.data?.message || "Failed to update visitor status.",
        "error"
      );
    } finally {
      setStatusLoadingId(null);
    }
  };

  // Delete Visitor
  const handleDeleteVisitor = async () => {
    if (!deletingVisitor) return;
    setIsDeleting(true);

    try {
      const response = await visitorApi.delete(deletingVisitor._id);
      if (response.data?.success) {
        setVisitors((prev) => prev.filter((v) => v._id !== deletingVisitor._id));
        showAlert("Visitor deleted successfully.", "success");
        setDeletingVisitor(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      showAlert(
        err.response?.data?.message || "Failed to delete visitor.",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Show Login Page if not authenticated ───────────────────
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          activeTab={activeTab}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="content-area">
          {/* Notification Alert Banner */}
          {alert && (
            <div
              className={`alert ${
                alert.type === "error"
                  ? "alert-error"
                  : alert.type === "info"
                  ? "alert-info"
                  : "alert-success"
              }`}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {alert.type === "error" ? (
                  <AlertCircle size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <span>{alert.message}</span>
              </div>
              <button
                onClick={() => setAlert(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                }}
                aria-label="Dismiss alert"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Tab Views */}
          {activeTab === "dashboard" && (
            <Dashboard
              visitors={visitors}
              isLoading={isLoading}
              onNavigateTab={setActiveTab}
              onEdit={(v) => setEditingVisitor(v)}
              onDelete={(v) => setDeletingVisitor(v)}
              onToggleStatus={handleToggleStatus}
              statusLoadingId={statusLoadingId}
            />
          )}

          {activeTab === "visitors" && (
            <Visitors
              visitors={visitors}
              isLoading={isLoading}
              onRefresh={fetchVisitors}
              onNavigateTab={setActiveTab}
              onEdit={(v) => setEditingVisitor(v)}
              onDelete={(v) => setDeletingVisitor(v)}
              onToggleStatus={handleToggleStatus}
              statusLoadingId={statusLoadingId}
            />
          )}

          {activeTab === "add-visitor" && (
            <AddVisitor
              onSubmit={handleCreateVisitor}
              onCancel={() => setActiveTab("visitors")}
              isSubmitting={isSubmitting}
            />
          )}
        </main>
      </div>

      {/* Edit Visitor Modal */}
      <EditVisitorModal
        isOpen={Boolean(editingVisitor)}
        visitor={editingVisitor}
        onUpdate={handleUpdateVisitor}
        onClose={() => setEditingVisitor(null)}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingVisitor)}
        title="Delete Visitor?"
        message={
          deletingVisitor
            ? `Are you sure you want to delete ${deletingVisitor.name}? This record will be permanently removed from the system.`
            : "Are you sure you want to delete this visitor?"
        }
        onConfirm={handleDeleteVisitor}
        onCancel={() => setDeletingVisitor(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default App;
