"use client";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENTS, BRANCHES } from "../../constants/visitorConstants";
import { exportToCSV } from "../../utils/storage";
import AnalyticsSection from "../Landing/AnalyticsSection";
import EmployeesList from "./EmployeesList";
import AddEmployeeModal from "./AddEmployeeModal";

import VisitorDetailModal from "./VisitorDetailModal";
import ThemeToggle from "../UI/ThemeToggle";
import BrandLogo from "../UI/BrandLogo";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { staggerContainer, fadeUpBounce } from "../../utils/animations";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import SidebarNavigation from "./SidebarNavigation";
import SuperAdminDashboardOverview from "./SuperAdminDashboardOverview";
import VisitorPassesList from "./VisitorPassesList";
import VisitorCategories from "./VisitorCategories";
import BlacklistedVisitors from "./BlacklistedVisitors";
import MeetingRequests from "./MeetingRequests";
import VisitorBookings from "./VisitorBookings";
import ApprovalQueue from "./ApprovalQueue";
import CalendarView from "./CalendarView";
import AllBranches from "./AllBranches";
import BranchAnalytics from "./BranchAnalytics";
import CreateBranch from "./CreateBranch";
import BranchPerformance from "./BranchPerformance";
import GenericModule from "./GenericModule";
import AdministrationOverview from "./AdministrationOverview";
import ReportsOverview from "./ReportsOverview";
import NotificationsOverview from "./NotificationsOverview";
import VerificationOverview from "./VerificationOverview";
import SettingsOverview from "./SettingsOverview";
import MembershipOverview from "./MembershipOverview";

import BranchManagementOverview from "./BranchManagementOverview";
import EmployeeManagementOverview from "./EmployeeManagementOverview";
import VisitorManagementOverview from "./VisitorManagementOverview";
import RegistrationForm from "../Visitor/RegistrationForm";
import BranchSubAdminDashboardOverview from "./BranchSubAdminDashboardOverview";
import SubAdminAppointments from "./SubAdminAppointments";

import "../../styles/dashboard.css";
import { useRouter } from "next/navigation";

export default function AdminDashboard({ visitors = [], onNavigate: externalOnNavigate, onUpdate, onReset }) {
  const router = useRouter();
  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });

  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showCreatePassModal, setShowCreatePassModal] = useState(false);
  const [latestEmployee, setLatestEmployee] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();
  const { refreshData } = useData();

  // Computations for dashboard statistics
  const total = visitors.length;
  const active = visitors.filter(v => v.status === "checked-in").length;
  const approved = visitors.filter(v => v.approvalStatus === "approved" && v.status === "pending").length;
  const pending = visitors.filter(v => v.approvalStatus === "pending").length;
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  const todayBookings = visitors.filter(v => v.visitDate === todayStr).length;

  const filtered = visitors.filter(v => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      v.fullName.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q) ||
      v.personToMeet.toLowerCase().includes(q) ||
      v.purpose.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    const matchDept = filterDept === "all" || v.department === filterDept;
    const matchBranch = filterBranch === "all" || v.branch === filterBranch;
    return matchSearch && matchStatus && matchDept && matchBranch;
  });

  const handleCheckIn = (id) => {
    onUpdate(id, {
      status: "checked-in",
      approvalStatus: "approved",
      checkInTime: new Date().toTimeString().slice(0, 5)
    });
  };

  const handleCheckOut = (id) => {
    onUpdate(id, {
      status: "checked-out",
      checkOutTime: new Date().toTimeString().slice(0, 5)
    });
  };

  const handleApprove = (id) => {
    onUpdate(id, { approvalStatus: "approved" });
  };

  const handleReject = (id) => {
    onUpdate(id, { approvalStatus: "rejected", status: "checked-out" });
  };

  const closeSidebar = () => setSidebarOpen(false);

  const handleNavTab = (tab) => {
    setActiveTab(tab);
    closeSidebar(); // auto-close on mobile when nav item clicked
  };

  // Tab label for header
  const tabLabel = activeTab === "dashboard"
    ? `Welcome back, ${user?.name || (user?.role === "admin" ? "Admin" : "Sub Admin")}`
    : activeTab.replace(/_/g, ' ');

  return (
    <div
      className="dash-root"
      style={{ background: isDark ? "#0B1220" : "#F8FAFC" }}
    >
      {/* Mobile Sidebar Overlay backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <SidebarNavigation
        activeTab={activeTab}
        setActiveTab={handleNavTab}
        onNavigate={onNavigate}
        userRole={user?.role || "superadmin"}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Workspace */}
      <main
        className="dash-main"
        style={{
          background: isDark
            ? "#020617"
            : "#eef2f7"
        }}
      >
        <div className="dash-content">

          {/* ── Header Toolbar ── */}
          <div className="dash-header">

            {/* Left: hamburger + title */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
              {/* Hamburger — shown only on tablet/mobile via CSS */}
              <button
                className="hamburger-btn"
                onClick={() => setSidebarOpen(prev => !prev)}
                style={{
                  background: isDark ? "rgba(255,255,255,0.06)" : "#fff",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                  color: isDark ? "#94a3b8" : "#475569"
                }}
                aria-label="Toggle Sidebar"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="dash-header-left">
                <h1 style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}>
                  {tabLabel}
                </h1>
                <p style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="dash-header-actions">

              {/* Search */}
              <div className="dash-search-wrap">
                <span className="dash-search-icon">🔍</span>
                <input
                  placeholder="Search..."
                  style={{
                    borderRadius: 12,
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                    background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                    color: isDark ? "#f8fafc" : "#0f172a",
                    fontSize: 14,
                    outline: "none"
                  }}
                />
              </div>

              {/* Notifications Bell */}
              <button
                className="dash-icon-btn"
                style={{
                  background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                  position: "relative"
                }}
              >
                <span style={{ fontSize: 18 }}>🔔</span>
                <span style={{
                  position: "absolute", top: 8, right: 8,
                  width: 8, height: 8, background: "#ef4444",
                  borderRadius: "50%",
                  border: isDark ? "2px solid #0f172a" : "2px solid #fff"
                }} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="dash-icon-btn"
                style={{
                  background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0"
                }}
              >
                {isDark ? <Sun size={18} color="#94a3b8" /> : <Moon size={18} color="#64748b" />}
              </button>

              {/* User Profile */}
              <div
                className="dash-profile"
                style={{ borderLeft: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0" }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 16, fontWeight: 800,
                  flexShrink: 0
                }}>
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="dash-profile-label">
                  <span style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#f8fafc" : "#0f172a" }}>
                    {user?.name || (user?.role === 'admin' ? 'Super Admin' : 'Sub Admin')}
                  </span>
                  <span style={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                    {user?.email || (user?.role === 'admin' ? 'admin@forge.com' : 'subadmin@forge.com')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* ── End Header ── */}

          {/* Stats Strip — only for visitor / analytics tabs */}
          {["visitors", "analytics"].includes(activeTab) && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="stats-strip"
            >
              {[
                { label: "Total Bookings",        val: total,         color: "#0d9488", subText: "Overall registered logs" },
                { label: "Daily Bookings",         val: todayBookings, color: "#6366f1", subText: "Today's registered logs" },
                { label: "Checked In Now",         val: active,        color: "#16a34a", subText: "Active in premises" },
                { label: "Approved Entry",         val: approved,      color: "#0891b2", subText: "Awaiting arrival desk" },
                { label: "Awaiting Approval",      val: pending,       color: "#e11d48", subText: "Cleared by host required" },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  variants={fadeUpBounce}
                  style={{
                    background: isDark ? "#111827" : "#FFFFFF",
                    borderRadius: 16,
                    padding: "1.25rem 1.5rem",
                    border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.1)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {card.label}
                  </span>
                  <span style={{ fontSize: 32, fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A" }}>
                    {card.val}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: card.color }} />
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{card.subText}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── Tab Content Area ── */}

          {activeTab === "dashboard" && (
            user?.role === 'subadmin'
              ? <BranchSubAdminDashboardOverview />
              : <SuperAdminDashboardOverview visitors={visitors} />
          )}

          {activeTab === "visitor_logbook" && (
            <motion.div variants={fadeUpBounce} initial="hidden" animate="visible" style={{ transitionDelay: "100ms" }}>
              {/* Filter bar */}
              <div style={{
                background: isDark ? "#111827" : "#FFFFFF",
                borderRadius: 16,
                border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.1)",
                padding: "1rem 1.25rem",
                marginBottom: "1.25rem",
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
                boxShadow: "var(--shadow-sm)"
              }}>
                <div style={{ position: "relative", flex: "1 1 200px", minWidth: 0 }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, ID, purpose, host..."
                    className="form-input"
                    style={{ paddingLeft: 36, width: "100%" }}
                  />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-input" style={{ width: "auto", minWidth: 130, cursor: "pointer" }}>
                  <option value="all">All States</option>
                  <option value="pending">Pending Desk</option>
                  <option value="checked-in">Checked In</option>
                  <option value="checked-out">Checked Out</option>
                </select>
                <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="form-input" style={{ width: "auto", minWidth: 150, cursor: "pointer" }}>
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="form-input" style={{ width: "auto", minWidth: 140, cursor: "pointer" }}>
                  <option value="all">All Locations</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <span style={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600, marginLeft: "auto" }}>
                  {filtered.length} log{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Table */}
              <div className="table-container" style={{ overflowX: "auto" }}>
                <table className="admin-table" style={{ minWidth: 800 }}>
                  <thead>
                    <tr>
                      {["Visitor Profile", "Appointment Details", "Department", "Location", "Check-In / Out", "Status", "Authorization", "Actions"].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                          <span>No visitor records match your filter constraints.</span>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((v) => (
                        <tr key={v.id} style={{ cursor: "pointer" }} onClick={() => setSelectedVisitor(v)}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {v.photo ? (
                                <img src={v.photo} alt={v.fullName} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "1px solid #e2e8f0" }} />
                              ) : (
                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #ccfbf1, #c7d2fe)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f46e5", fontWeight: 700, fontSize: 13 }}>
                                  {v.fullName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div style={{ fontWeight: 700, color: isDark ? "#f8fafc" : "#0f172a", fontSize: 13 }}>{v.fullName}</div>
                                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{v.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: isDark ? "#e2e8f0" : "#334155", fontSize: 13 }}>{v.purpose}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>Host: {v.personToMeet}</div>
                          </td>
                          <td style={{ fontSize: 13, fontWeight: 500, color: isDark ? "#cbd5e1" : "#475569" }}>{v.department}</td>
                          <td style={{ fontSize: 13, fontWeight: 500, color: isDark ? "#cbd5e1" : "#475569" }}>{v.branch}</td>
                          <td>
                            <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#e2e8f0" : "#334155" }}>{v.visitDate}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                              {v.checkInTime ? `${v.checkInTime}` : "—"}{v.checkOutTime ? ` to ${v.checkOutTime}` : ""}
                            </div>
                          </td>
                          <td>
                            <span style={{
                              background: v.status === "checked-in" ? "#dcfce7" : v.status === "checked-out" ? "#f1f5f9" : "#fff1f2",
                              color: v.status === "checked-in" ? "#15803d" : v.status === "checked-out" ? "#475569" : "#be123c",
                              borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap"
                            }}>
                              {v.status === "checked-in" ? "Checked In" : v.status === "checked-out" ? "Checked Out" : "Pending"}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              background: v.approvalStatus === "approved" ? "#f0fdfa" : v.approvalStatus === "rejected" ? "#fef2f2" : "#fff1f2",
                              color: v.approvalStatus === "approved" ? "#0f766e" : v.approvalStatus === "rejected" ? "#991b1b" : "#be123c",
                              borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap"
                            }}>
                              {v.approvalStatus.toUpperCase()}
                            </span>
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {v.approvalStatus === "pending" && (
                                <>
                                  <button onClick={() => handleApprove(v.id)} className="btn btn-success" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6 }}>Approve</button>
                                  <button onClick={() => handleReject(v.id)} className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6 }}>Reject</button>
                                </>
                              )}
                              {v.status === "pending" && v.approvalStatus === "approved" && (
                                <button onClick={() => handleCheckIn(v.id)} className="btn btn-primary" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6, background: "#16a34a" }}>Check In</button>
                              )}
                              {v.status === "checked-in" && (
                                <button onClick={() => handleCheckOut(v.id)} className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6, border: "1.5px solid #cbd5e1" }}>Check Out</button>
                              )}
                              <button onClick={() => setSelectedVisitor(v)} className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6, background: "#f8fafc" }}>Details</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "visitor_categories"   && <VisitorCategories />}
          {activeTab === "active_visitors"       && <VisitorPassesList visitors={visitors} forcedFilter="checked-in" hideFilterDropdown={true} />}
          {activeTab === "expired_passes"        && <VisitorPassesList visitors={visitors} forcedFilter="checked-out" hideFilterDropdown={true} />}
          {activeTab === "blacklisted_visitors"  && <BlacklistedVisitors />}
          {activeTab === "visitor_passes"        && <VisitorPassesList visitors={visitors} />}
          {activeTab === "meeting_requests"      && <MeetingRequests />}
          {activeTab === "visitor_bookings"      && <VisitorBookings />}
          {activeTab === "approval_queue"        && <ApprovalQueue />}
          {activeTab === "calendar_view"         && <CalendarView />}

          {activeTab === "employees" && (
            <motion.div variants={fadeUpBounce} initial="hidden" animate="visible">
              <EmployeesList onAddClick={() => setShowEmpModal(true)} />
            </motion.div>
          )}

          {activeTab === "all_branches"         && <AllBranches setActiveTab={setActiveTab} />}
          {activeTab === "branch_analytics"     && <BranchAnalytics />}
          {activeTab === "create_branch"        && <CreateBranch />}
          {activeTab === "branch_performance"   && <BranchPerformance />}

          {activeTab === "administration"       && <AdministrationOverview />}
          {activeTab === "visitor_management"   && (
            <VisitorManagementOverview 
              visitors={visitors} 
              setActiveTab={setActiveTab} 
              onCreatePassClick={() => setShowCreatePassModal(true)} 
            />
          )}
          {activeTab === "branch_management"    && <BranchManagementOverview setActiveTab={setActiveTab} />}
          {activeTab === "employee_management"  && <EmployeeManagementOverview onAddEmployeeClick={() => setShowEmpModal(true)} />}
          {activeTab === "reports_analytics"    && <ReportsOverview />}
          {activeTab === "notifications"        && <NotificationsOverview />}
          {activeTab === "verification_center"  && <VerificationOverview />}
          {activeTab === "settings"             && <SettingsOverview />}
          {activeTab === "membership_management" && <MembershipOverview />}

          {/* Sub Admin specific tabs */}
          {activeTab === "appointments" && (
            <SubAdminAppointments
              onApprove={(id) => onUpdate(id, { approvalStatus: "approved" })}
              onReject={(id) => onUpdate(id, { approvalStatus: "rejected", status: "checked-out" })}
            />
          )}
          {activeTab === "vendor_management" && <GenericModule tabId="vendor_management" />}

          {/* Fallback generic module */}
          {!["dashboard","visitor_passes","visitor_categories","active_visitors","expired_passes",
             "blacklisted_visitors","visitor_logbook","qr_scan_logs","visitor_reports","employees",
             "all_branches","branch_analytics","create_branch","branch_performance","meeting_requests",
             "visitor_bookings","approval_queue","calendar_view","administration","visitor_management",
             "branch_management","employee_management","reports_analytics","notifications",
             "verification_center","settings","membership_management",
             "appointments","vendor_management"].includes(activeTab) && (
            <GenericModule tabId={activeTab} />
          )}

        </div>{/* /dash-content */}
      </main>

      {/* Modals */}
      {selectedVisitor && (
        <VisitorDetailModal
          visitor={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {showEmpModal && (
        <AddEmployeeModal
          onClose={() => setShowEmpModal(false)}
          onAdd={(emp) => {
            setLatestEmployee(emp);
            refreshData();
            setShowEmpModal(false);
          }}
        />
      )}

      {showCreatePassModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(11, 18, 32, 0.8)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }} onClick={() => setShowCreatePassModal(false)}>
          <div style={{
            background: isDark ? "#0F172A" : "#FFFFFF",
            borderRadius: 24,
            padding: 32,
            width: "100%",
            maxWidth: 900,
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowCreatePassModal(false)}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDark ? "#94a3b8" : "#475569",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 700,
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"}
            >
              ✕
            </button>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A" }}>Create Visitor Pass</h2>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: isDark ? "#94a3b8" : "#64748b" }}>Register a new visitor and generate an instant pass</p>
            </div>
            <RegistrationForm 
              onNavigate={() => setShowCreatePassModal(false)}
              onNewVisitor={() => setShowCreatePassModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
