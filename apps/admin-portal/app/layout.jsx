import "../../../src/index.css";
import "../../../src/styles/dashboard.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Super Admin Portal — Forge India Connect",
  description: "Executive visitor management console, branch controls, and analytics.",
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
