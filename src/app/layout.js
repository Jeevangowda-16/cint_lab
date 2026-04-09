import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/lib/authContext";

export const metadata = {
  title: "CINT Lab",
  description: "Advancing Computer Science and Engineering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white">
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