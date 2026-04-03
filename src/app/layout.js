import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export const metadata = {
  title: "CINT Lab",
  description: "Advancing Computer Science Research",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white">
        <Navbar />

        {/* This {children} block is where your page content gets injected! */}
        <div className="flex-grow">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}