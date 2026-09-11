import { Outfit } from "next/font/google";
import "@/styles/globals.css";
import LayoutWrapper from "./LayoutWrapper.jsx";

const outfit = Outfit({
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Event Ticket Booking App",
  description: "Multiple Vendor Event Ticket Booking App",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
        </body>
    </html>
  );
}
