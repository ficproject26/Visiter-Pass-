"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export const PremiumInput = ({
  label,
  value,
  onChange,
  error,
  success,
  disabled,
  type = "text",
  placeholder = "",
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useTheme();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isActive = isFocused || value?.length > 0 || type === "date" || type === "time";

  // Status colors
  const baseBorder = isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-300 bg-white/50";
  const focusBorder = "border-indigo-500 bg-indigo-50/5 dark:bg-indigo-900/10 shadow-[0_0_12px_rgba(99,102,241,0.15)]";
  const errorBorder = "border-rose-500 bg-rose-50/5 dark:bg-rose-900/10 shadow-[0_0_12px_rgba(244,63,94,0.15)]";
  const successBorder = "border-teal-500 bg-teal-50/5 dark:bg-teal-900/10 shadow-[0_0_12px_rgba(20,184,166,0.15)]";

  const currentBorder = disabled ? baseBorder : error ? errorBorder : success ? successBorder : isFocused ? focusBorder : baseBorder;

  return (
    <div className={`relative ${className} w-full`}>
      <div
        className={`relative h-[56px] rounded-xl border transition-all duration-300 ${currentBorder} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`absolute inset-0 w-full h-full px-4 pt-5 pb-1 bg-transparent outline-none text-sm font-semibold 
            ${isDark ? 'text-white' : 'text-slate-900'} 
            ${disabled ? 'cursor-not-allowed' : ''}
            [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50
          `}
          {...props}
        />

        {/* Floating Label */}
        <label
          className={`absolute left-4 transition-all duration-300 pointer-events-none origin-left
            ${isActive ? 'top-1.5 text-[11px] uppercase tracking-wider font-bold opacity-80' : 'top-1/2 -translate-y-1/2 text-sm font-medium opacity-50'}
            ${error ? 'text-rose-500' : success ? 'text-teal-500' : isFocused ? 'text-indigo-500' : isDark ? 'text-slate-300' : 'text-slate-600'}
          `}
        >
          {label}
        </label>

        {/* Status Indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {success && !error && type !== "date" && type !== "time" && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-teal-500 text-lg">
              ✓
            </motion.span>
          )}
          {error && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-rose-500 text-lg font-bold">
              !
            </motion.span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1 absolute -bottom-5 left-0"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export const PremiumSelect = ({
  label,
  value,
  onChange,
  error,
  success,
  disabled,
  options,
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useTheme();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isActive = isFocused || value?.length > 0;

  const baseBorder = isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-300 bg-white/50";
  const focusBorder = "border-indigo-500 bg-indigo-50/5 dark:bg-indigo-900/10 shadow-[0_0_12px_rgba(99,102,241,0.15)]";
  const errorBorder = "border-rose-500 bg-rose-50/5 dark:bg-rose-900/10 shadow-[0_0_12px_rgba(244,63,94,0.15)]";
  const successBorder = "border-teal-500 bg-teal-50/5 dark:bg-teal-900/10 shadow-[0_0_12px_rgba(20,184,166,0.15)]";

  const currentBorder = disabled ? baseBorder : error ? errorBorder : success ? successBorder : isFocused ? focusBorder : baseBorder;

  return (
    <div className={`relative ${className} w-full`}>
      <div
        className={`relative h-[56px] rounded-xl border transition-all duration-300 ${currentBorder} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <select
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`absolute inset-0 w-full h-full px-4 pt-5 pb-1 bg-transparent outline-none text-sm font-semibold appearance-none cursor-pointer
            ${isDark ? 'text-white' : 'text-slate-900'} 
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          {...props}
        >
          <option value="" disabled className={isDark ? "bg-slate-800" : "bg-white"}></option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value || opt} className={isDark ? "bg-slate-800" : "bg-white"}>
              {opt.label || opt}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow Indicator */}
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ${isFocused ? 'rotate-180 text-indigo-500' : 'opacity-40'}`}>
          ▼
        </div>

        {/* Floating Label */}
        <label
          className={`absolute left-4 transition-all duration-300 pointer-events-none origin-left
            ${isActive ? 'top-1.5 text-[11px] uppercase tracking-wider font-bold opacity-80' : 'top-1/2 -translate-y-1/2 text-sm font-medium opacity-50'}
            ${error ? 'text-rose-500' : success ? 'text-teal-500' : isFocused ? 'text-indigo-500' : isDark ? 'text-slate-300' : 'text-slate-600'}
          `}
        >
          {label}
        </label>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1 absolute -bottom-5 left-0"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
