import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fieldline | AWS Splunk platform",
  description: "Self-service Splunk deployments on AWS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
