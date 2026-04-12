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
      <body className={`${inter.className} flex flex-col min-h-screen bg-[#e6edf7]`}>
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