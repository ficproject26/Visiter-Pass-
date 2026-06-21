"use client";

import { ThemeProvider } from "../src/context/ThemeContext";
import { AuthProvider } from "../src/context/AuthContext";
import { DataProvider } from "../src/context/DataContext";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
