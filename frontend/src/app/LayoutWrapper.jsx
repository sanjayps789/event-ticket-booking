"use client";

import { ToastContainer } from "react-toastify";
import ReduxProvider from "../redux/reduxProvider.jsx";

export default function LayoutWrapper({ children }) {
  return (
    <ReduxProvider>
      <main className="overflow-x-hidden relative min-h-screen">
        {children}
      </main>
      <ToastContainer theme="dark" autoClose={3000} />
    </ReduxProvider>
  );
}