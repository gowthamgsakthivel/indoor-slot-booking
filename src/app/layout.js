import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppSessionProvider from "@/components/SessionProvider";
import BottomNav from "@/components/BottomNav";
import TopHeader from "@/components/TopHeader";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "NKL Sports Club | Badminton Booking",
  description:
    "Book badminton courts, reserve slots, and manage schedules at NKL Sports Club.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppSessionProvider>
          <TopHeader />
          <div className="app-shell">{children}</div>
          <BottomNav />
        </AppSessionProvider>
      </body>
    </html>
  );
}
