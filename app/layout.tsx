import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saminhometutors.com"),
  title: "Samin Home Tutors | World-Class 1-on-1 Live Online Lessons",
  description:
    "Empowering academic excellence with handpicked elite tutors for GCSE, A-Levels, IB, 11+, and University Admissions. 100% interactive 1-on-1 online lessons.",
  keywords: [
    "Samin Home Tutors",
    "online tuition",
    "private tutor",
    "GCSE tutors",
    "A-Level tuition",
    "Oxbridge prep",
    "maths tutor",
    "science tutor",
    "1-on-1 online lessons",
  ],
  icons: {
    icon: "/images/samin_logo.jpeg",
    shortcut: "/images/samin_logo.jpeg",
    apple: "/images/samin_logo.jpeg",
  },
  openGraph: {
    title: "Samin Home Tutors | Premier Academic Tutoring",
    description: "Exceptional 1-on-1 tutoring by subject specialists from top universities.",
    images: [{ url: "/images/samin_logo.jpeg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#faf9f6] text-[#1a1a2e] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
