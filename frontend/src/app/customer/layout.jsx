import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function CustomerLayout({ children }) {
    return <ProtectedRoute allowedRole="CUSTOMER">{children}</ProtectedRoute>;
}