import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/lib/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CINT Lab",
  description: "Advancing Computer Science and Engineering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-blue-300 opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-indigo-300 opacity-20 rounded-full blur-3xl" />
        </div>
        <AuthProvider>
          <Navbar />

          <div className="flex-grow">
            {children}
          </div>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}