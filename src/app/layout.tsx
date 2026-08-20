import type { Metadata } from "next";
import { Roboto_Slab, Jost } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "De-Escalation Training, CHCR",
  description: "CHCR de-escalation training",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${robotoSlab.variable} ${jost.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
