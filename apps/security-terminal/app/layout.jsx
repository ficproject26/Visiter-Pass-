import "../../../src/index.css";
import "../../../src/styles/dashboard.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Security Gate Terminal — Forge India Connect",
  description: "Security Gate Verification, QR Pass Scanner, and Entry/Exit Terminal.",
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
