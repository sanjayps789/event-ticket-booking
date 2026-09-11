import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function OrganizerLayout({ children }) {
  return <ProtectedRoute allowedRole="ORGANIZER">{children}</ProtectedRoute>;
}