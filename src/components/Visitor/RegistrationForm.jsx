"use client";
import React, { useState } from "react";
import { DEPARTMENTS, BRANCHES, ID_TYPES, PURPOSES, VISITOR_TYPES, generateId } from "../../constants/visitorConstants";
import WebcamCapture from "../UI/WebcamCapture";
import VisitorPass from "./VisitorPass";
import BrandLogo from "../UI/BrandLogo";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpBounce } from "../../utils/animations";
import { API_BASE_URL } from "../../config/api";
import { useRouter } from "next/navigation";

export default function RegistrationForm({ onNavigate: externalOnNavigate, onNewVisitor }) {
  const router = useRouter();
  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });
  
  const [form, setForm] = useState({
    visitorType: "Guest Visitor", fullName: "", phone: "", emergencyContact: "", email: "", gender: "Male",
    idType: "", idNumber: "", idProof: null,
    purpose: "", personToMeet: "", department: "", branch: "", visitDate: "", checkInTime: "",
    vehicleNumber: "", photo: null
  });
  const [errors, setErrors] = useState({});
  const [successes, setSuccesses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [newVisitor, setNewVisitor] = useState(null);
  const { isDark } = useTheme();
  const { employees, refreshData } = useData();

  // Dynamic Options from backend data — exclude system/admin roles from department list
  const adminRoles = ['sub admin', 'administrator', 'super admin', 'sub administrator'];
  const dynamicDepartments = [...new Set(
    employees
      .map(e => e.department)
      .filter(d => d && !adminRoles.includes(d.toLowerCase()))
  )].sort();
  const dynamicBranches = [...new Set(employees.map(e => e.location).filter(Boolean))].sort();
  const dynamicHosts = employees.map(e => e.name).sort();

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handlePhoneChange = (key, value) => {
    const val = value.replace(/\D/g, '').slice(0, 10);
    setField(key, val);
    if (val.length === 10) {
      setSuccesses(prev => ({ ...prev, [key]: true }));
    } else {
      setSuccesses(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleIdNumberChange = (value) => {
    let val = value.toUpperCase();
    let isSuccess = false;

    if (form.idType === "Aadhaar") {
      let clean = val.replace(/\D/g, '').slice(0, 12);
      let formatted = '';
      for (let i = 0; i < clean.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += clean[i];
      }
      setField('idNumber', formatted);
      if (clean.length === 12) isSuccess = true;
    } else if (form.idType === "PAN Card") {
      val = val.replace(/[^A-Z0-9]/g, '').slice(0, 10);
      let valid = "";
      for (let i = 0; i < val.length; i++) {
        const char = val[i];
        if (i < 5) {
          if (/[A-Z]/.test(char)) valid += char; else break;
        } else if (i < 9) {
          if (/[0-9]/.test(char)) valid += char; else break;
        } else if (i === 9) {
          if (/[A-Z]/.test(char)) valid += char; else break;
        }
      }
      setField('idNumber', valid);
      if (valid.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(valid)) isSuccess = true;
    } else if (form.idType === "Driving License") {
      val = val.replace(/[^A-Z0-9]/g, '').slice(0, 15);
      setField('idNumber', val);
      if (val.length >= 15 && /^[A-Z]{2}[0-9]{13}$/.test(val)) isSuccess = true;
    } else if (form.idType === "Passport") {
      val = val.replace(/[^A-Z0-9]/g, '').slice(0, 8);
      setField('idNumber', val);
      if (val.length === 8 && /^[A-Z][1-9]\d{6}$/.test(val)) isSuccess = true;
    } else if (form.idType === "Voter ID") {
      val = val.replace(/[^A-Z0-9]/g, '').slice(0, 10);
      let valid = "";
      for (let i = 0; i < val.length; i++) {
        const char = val[i];
        if (i < 3) {
          if (/[A-Z]/.test(char)) valid += char; else break;
        } else {
          if (/[0-9]/.test(char)) valid += char; else break;
        }
      }
      setField('idNumber', valid);
      if (valid.length === 10 && /^[A-Z]{3}[0-9]{7}$/.test(valid)) isSuccess = true;
    } else {
      setField('idNumber', value);
      if (value.length > 5) isSuccess = true;
    }

    setSuccesses(prev => ({ ...prev, idNumber: isSuccess }));
  };

  const handleIdTypeChange = (value) => {
    setField('idType', value);
    setField('idNumber', '');
    setSuccesses(prev => ({ ...prev, idNumber: false, idType: true }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!/^\d{10}$/.test(form.emergencyContact)) e.emergencyContact = "Enter a valid 10-digit emergency contact";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";

    if (!form.idType) e.idType = "Select an ID type";
    else {
      if (!form.idNumber.trim()) e.idNumber = "ID number is required";
      else {
        if (form.idType === "Aadhaar" && !/^\d{4} \d{4} \d{4}$/.test(form.idNumber)) e.idNumber = "Invalid Aadhaar format";
        if (form.idType === "PAN Card" && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.idNumber)) e.idNumber = "Invalid PAN format";
        if (form.idType === "Driving License" && form.idNumber.length < 15) e.idNumber = "Invalid DL format";
        if (form.idType === "Passport" && form.idNumber.length < 8) e.idNumber = "Invalid Passport format";
        if (form.idType === "Voter ID" && !/^[A-Z]{3}[0-9]{7}$/.test(form.idNumber)) e.idNumber = "Invalid Voter ID format";
      }
    }
    if (!form.idProof) e.idProof = "ID proof image is required";

    if (!form.purpose) e.purpose = "Select visit purpose";
    if (!form.personToMeet.trim()) e.personToMeet = "Host name is required";
    if (!form.department) e.department = "Select host department";
    if (!form.branch) e.branch = "Select location/branch";
    if (!form.visitDate) e.visitDate = "Select visit date";
    if (!form.checkInTime) e.checkInTime = "Select expected time";

    if (!form.photo) e.photo = "Live photo is required";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const visitor = {
      ...form,
      id: generateId(),
      status: "PENDING",
      approvalStatus: "PENDING",
      checkOutTime: null
    };

    try {
      await fetch(`${API_BASE_URL}/api/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitor)
      });
      refreshData();
    } catch (err) {
      console.error(err);
    }

    // Call onNewVisitor just for App.jsx backward compatibility if needed, but it's redundant now.
    // onNewVisitor(visitor);
    
    setNewVisitor(visitor);
    setSubmitted(true);
  };

  if (submitted && newVisitor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: isDark ? "#08262b" : "#F8FAFC",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "var(--font-primary)",
        }}
      >
        <div
          className="animate-scale-up"
          style={{
            width: "100%",
            maxWidth: 520,
            background: isDark ? "#111827" : "white",
            borderRadius: 24,
            padding: "3rem 2.5rem",
            boxShadow: isDark
              ? "0 25px 50px -12px rgba(0,0,0,0.5)"
              : "0 25px 50px -12px rgba(15,23,42,0.08)",
            border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(15,23,42,0.05)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0d9488, #0891b2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: 36,
              color: "white",
              boxShadow: "0 8px 20px -6px rgba(13,148,136,0.5)",
            }}
          >
            ✓
          </div>

          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: isDark ? "white" : "#0f172a",
              marginBottom: 8,
              letterSpacing: "-0.5px",
            }}
          >
            Registration Submitted
          </h2>
          <p
            style={{
              color: isDark ? "#94a3b8" : "#64748b",
              fontSize: 14,
              lineHeight: 1.5,
              maxWidth: 400,
              margin: "0 auto 2rem",
            }}
          >
            Your request is currently **Pending Approval** from host admin. Once approved, the digital pass will be sent to your email.
          </p>

          {/* Pass ID Card Display */}
          <div
            style={{
              background: isDark ? "#1f2937" : "#f8fafc",
              border: isDark ? "1px solid #374151" : "1px solid #e2e8f0",
              borderRadius: 16,
              padding: "1.25rem 2rem",
              marginBottom: "2.5rem",
              display: "inline-block",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: isDark ? "#2dd4bf" : "#0d9488",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
              }}
            >
              Temporary Pass Reference ID
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 850,
                color: isDark ? "white" : "#0f172a",
                letterSpacing: "2px",
              }}
            >
              {newVisitor.id}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => onNavigate("check-status")}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
                fontWeight: 700,
                border: 0,
                cursor: "pointer",
                color: "white",
              }}
            >
              🔍 Check Pass & Download Status
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setNewVisitor(null);
                  setForm({
                    visitorType: "Guest Visitor",
                    fullName: "",
                    phone: "",
                    emergencyContact: "",
                    email: "",
                    gender: "Male",
                    idType: "",
                    idNumber: "",
                    idProof: null,
                    purpose: "",
                    personToMeet: "",
                    department: "",
                    branch: "",
                    visitDate: "",
                    checkInTime: "",
                    vehicleNumber: "",
                    photo: null,
                  });
                }}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
                  color: isDark ? "white" : "#0f172a",
                }}
              >
                + Register New
              </button>
              <button
                onClick={() => onNavigate("landing")}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
                  color: isDark ? "white" : "#0f172a",
                }}
              >
                Home Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#08262b" : "#F8FAFC", fontFamily: "var(--font-primary)" }}>
      {/* Navbar Header */}
      <header style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 100%)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "var(--shadow-md)" }}>
        <BrandLogo onNavigate={onNavigate} variant="header" isDark={true} />
        <button
          onClick={() => onNavigate("landing")}
          className="btn btn-secondary"
          style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "white", padding: "6px 14px", fontSize: 13 }}
        >
          ← Exit Registration
        </button>
      </header>

      {/* Form Area */}
      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: 900, margin: "3rem auto", padding: "0 1.5rem" }}
      >
        <motion.div variants={fadeUpBounce} style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: isDark ? "white" : "#0f172a", marginBottom: 12, letterSpacing: "-1px" }}>Visitor Registration</h1>
          <p style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Please fill in the security details. Your host will be requested for authorization upon submission.</p>
        </motion.div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Main sections layout */}
          <motion.div variants={fadeUpBounce} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", background: isDark ? "#111827" : "#FFFFFF", borderRadius: 20, border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(15,23,42,0.05)", overflow: "hidden", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}>

            {/* Left side: Photo capture fallback */}
            <div style={{ padding: "2rem", background: isDark ? "rgba(13,148,136,0.05)" : "#f8fafc", borderRight: isDark ? "1px solid rgba(13,148,136,0.15)" : "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: 4 }}>Verify Identity</h3>
                <p style={{ fontSize: 12, color: "#64748b", maxWidth: 220 }}>Capture a live photo or upload a picture for security clearance badges.</p>
              </div>
              <WebcamCapture
                onCapture={(imgData) => setField("photo", imgData)}
                initialPhoto={form.photo}
              />
              {errors.photo && <span style={{ fontSize: 12, color: "#ef4444", fontWeight: "bold" }}>{errors.photo}</span>}
            </div>

            {/* Right side: Info inputs */}
            <div style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <span>👤</span> Personal Information
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Full name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Full Name *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setField("fullName", e.target.value)}
                    placeholder="Enter your name"
                    className="form-input"
                    style={{ borderColor: errors.fullName ? "#ef4444" : successes.fullName ? "#10b981" : "" }}
                  />
                  {errors.fullName && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.fullName}</span>}
                </div>

                {/* Phone & Emergency */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Phone Number *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => handlePhoneChange("phone", e.target.value)}
                      placeholder="9876543210"
                      className="form-input"
                      style={{ borderColor: errors.phone ? "#ef4444" : successes.phone ? "#10b981" : "" }}
                    />
                    {errors.phone && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.phone}</span>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Emergency Contact *</label>
                    <input
                      type="tel"
                      value={form.emergencyContact}
                      onChange={e => handlePhoneChange("emergencyContact", e.target.value)}
                      placeholder="10-digit number"
                      className="form-input"
                      style={{ borderColor: errors.emergencyContact ? "#ef4444" : successes.emergencyContact ? "#10b981" : "" }}
                    />
                    {errors.emergencyContact && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.emergencyContact}</span>}
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setField("email", e.target.value)}
                    placeholder="name@email.com"
                    className="form-input"
                    style={{ borderColor: errors.email ? "#ef4444" : "" }}
                  />
                  {errors.email && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.email}</span>}
                </div>

                {/* ID Type & Number */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>ID Verification Type *</label>
                    <select
                      value={form.idType}
                      onChange={e => handleIdTypeChange(e.target.value)}
                      className="form-input"
                      style={{ borderColor: errors.idType ? "#ef4444" : "", cursor: "pointer" }}
                    >
                      <option value="">Select ID type...</option>
                      {ID_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.idType && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.idType}</span>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>ID Document Number *</label>
                    <input
                      type="text"
                      value={form.idNumber}
                      onChange={e => handleIdNumberChange(e.target.value)}
                      placeholder={
                        form.idType === 'Aadhaar' ? 'XXXX XXXX XXXX' : 
                        form.idType === 'PAN Card' ? 'ABCDE1234F' : 
                        form.idType === 'Voter ID' ? 'ABC1234567' : 
                        'Enter ID number'
                      }
                      className="form-input"
                      disabled={!form.idType}
                      style={{ borderColor: errors.idNumber ? "#ef4444" : successes.idNumber ? "#10b981" : "" }}
                    />
                    {errors.idNumber && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.idNumber}</span>}
                  </div>
                </div>

                {/* ID Proof Image */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Upload ID Proof (Image) *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => setField("idProof", reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="form-input"
                    style={{ borderColor: errors.idProof ? "#ef4444" : "", padding: "6px" }}
                  />
                  {errors.idProof && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.idProof}</span>}
                  {form.idProof && <span style={{ fontSize: 11, color: "#10b981" }}>✓ ID proof uploaded</span>}
                </div>

              </div>
            </div>
          </motion.div>

          {/* Visit details sub-section */}
          <motion.div variants={fadeUpBounce} style={{ padding: "2.5rem", background: isDark ? "#111827" : "#FFFFFF", borderRadius: 20, border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(15,23,42,0.05)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>📋</span> Visit Details
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {/* Purpose */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Purpose of Visit *</label>
                <select
                  value={form.purpose}
                  onChange={e => setField("purpose", e.target.value)}
                  className="form-input"
                  style={{ borderColor: errors.purpose ? "#ef4444" : "", cursor: "pointer" }}
                >
                  <option value="">Select purpose...</option>
                  {PURPOSES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.purpose && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.purpose}</span>}
              </div>

              {/* Host person */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Person to Meet (Host) *</label>
                <input
                  type="text"
                  list="host-options"
                  value={form.personToMeet}
                  onChange={e => setField("personToMeet", e.target.value)}
                  placeholder="e.g. Priyan Sharma"
                  className="form-input"
                  style={{ borderColor: errors.personToMeet ? "#ef4444" : "" }}
                />
                <datalist id="host-options">
                  {dynamicHosts.map(o => <option key={o} value={o} />)}
                </datalist>
                {errors.personToMeet && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.personToMeet}</span>}
              </div>

              {/* Department */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Department *</label>
                <select
                  value={form.department}
                  onChange={e => setField("department", e.target.value)}
                  className="form-input"
                  style={{ borderColor: errors.department ? "#ef4444" : "", cursor: "pointer" }}
                >
                  <option value="">Select department...</option>
                  {dynamicDepartments.length > 0 ? dynamicDepartments.map(o => <option key={o} value={o}>{o}</option>) : DEPARTMENTS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.department && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.department}</span>}
              </div>

              {/* Branch */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Office Location / Branch *</label>
                <select
                  value={form.branch}
                  onChange={e => setField("branch", e.target.value)}
                  className="form-input"
                  style={{ borderColor: errors.branch ? "#ef4444" : "", cursor: "pointer" }}
                >
                  <option value="">Select location...</option>
                  {dynamicBranches.length > 0 ? dynamicBranches.map(o => <option key={o} value={o}>{o}</option>) : BRANCHES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.branch && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.branch}</span>}
              </div>

              {/* Visit Date */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Visit Date *</label>
                <input
                  type="date"
                  value={form.visitDate}
                  onChange={e => setField("visitDate", e.target.value)}
                  className="form-input"
                  style={{ borderColor: errors.visitDate ? "#ef4444" : "" }}
                />
                {errors.visitDate && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.visitDate}</span>}
              </div>

              {/* Time */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Expected Check-in Time *</label>
                <input
                  type="time"
                  value={form.checkInTime}
                  onChange={e => setField("checkInTime", e.target.value)}
                  className="form-input"
                  style={{ borderColor: errors.checkInTime ? "#ef4444" : "" }}
                />
                {errors.checkInTime && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.checkInTime}</span>}
              </div>

              {/* Vehicle */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(248,250,252,0.55)" : "#475569" }}>Vehicle Number (optional)</label>
                <input
                  type="text"
                  value={form.vehicleNumber}
                  onChange={e => setField("vehicleNumber", e.target.value)}
                  placeholder="e.g. KA-01-AB-1234"
                  className="form-input"
                />
              </div>
            </div>
          </motion.div>

          {/* Action buttons footer */}
          <motion.div variants={fadeUpBounce} style={{ padding: "1.5rem 2rem", background: isDark ? "rgba(13,148,136,0.05)" : "#FFFFFF", borderRadius: 20, border: isDark ? "1px solid rgba(13,148,136,0.15)" : "1px solid rgba(15,23,42,0.05)", display: "flex", justifyItems: "end", justifyContent: "flex-end", gap: 16, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}>
            <button
              type="button"
              onClick={() => {
                setForm({ fullName: "", phone: "", email: "", idType: "", idNumber: "", purpose: "", personToMeet: "", department: "", branch: "", visitDate: "", checkInTime: "", vehicleNumber: "", emergencyContact: "", photo: null, idProof: null });
                setErrors({});
              }}
              className="btn btn-secondary"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "11px 28px" }}
            >
              Register & Generate Pass →
            </button>
          </motion.div>
        </form>
      </motion.main>
    </div>
  );
}
