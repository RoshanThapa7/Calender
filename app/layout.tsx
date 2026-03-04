import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Cute Tracker",
  description: "A cute and simple personal calendar tracker",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
