"use client";

import { ToastContainer } from "react-toastify";
import ReduxProvider from "../redux/reduxProvider.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import { usePathname } from "next/navigation.js";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const authRoutes = ["/login", "/register"];

  const hideLayout = authRoutes.includes(pathname);



  return (
    <ReduxProvider>
      {!hideLayout && <Navbar />}

      <main className={`overflow-x-hidden relative min-h-screen ${hideLayout ? '' : 'md:pt-22 pt-10'}`}>
        {children}
      </main>
      <ToastContainer theme="dark" autoClose={3000} />
    </ReduxProvider>
  );
}