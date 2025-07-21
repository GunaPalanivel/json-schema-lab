import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JSON Schema lab",
  description:
    "Craft and Visualize Complex JSON Schemas Instantly — No Code, All Control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
