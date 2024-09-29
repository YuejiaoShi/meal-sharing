import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/ui/Footer";
import NavBar from "@/components/ui/Navbar";
import ThemeProviderClient from "@/context/themeContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Meal Sharing",
  description: "Meal Sharing App",
};

const mode = "light";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviderClient>
          <div className="flex flex-col min-h-screen" color="primary">
            <NavBar />
            <main className="flex-grow">{children}</main>
          </div>
          <Footer />
        </ThemeProviderClient>
      </body>
    </html>
  );
}
