import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "RaftraCare — Hospital Operations System",
  description: "One hospital. One patient record. One connected workflow. Powered by RaftraCare HospitalOS.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon.png",
    apple: "/icon-512.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AuthProvider>
            <Providers>{children}</Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
