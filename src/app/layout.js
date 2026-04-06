import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/lib/authContext";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "CINT Lab",
  description: "Advancing Computer Science and Engineering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} flex flex-col min-h-screen bg-white`}>
        <AuthProvider>
          <Navbar />

          {/* This {children} block is where your page content gets injected! */}
          <div className="flex-grow">
            {children}
          </div>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}