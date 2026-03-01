import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const AuthProvider = dynamic(() => import("@/components/AuthProvider"), {
  ssr: false,
});
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yu Ling Store - Tranh Tô Màu Số Hóa",
  description: "Mua tranh tô màu số hóa hoặc tạo tranh tùy chỉnh bằng AI",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
          <Chatbot />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
