import "../src/index.css";
import "../src/styles/dashboard.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Forge India Connect — Intelligent Visitor Management System",
  description: "Modern Visitor Management System built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
