import "../../../src/index.css";
import "../../../src/styles/dashboard.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Forge India Connect — Visitor Self Check-In & Digital Pass",
  description: "Register for visits, track host approvals, and generate digital gate passes.",
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
