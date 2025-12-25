import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { dbUser, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FFAB00]">SCANNING CLEARANCE...</div>;

  if (!dbUser || dbUser.role !== "ADMIN") {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 space-y-4">
            <ShieldAlert className="w-16 h-16" />
            <h1 className="font-display text-4xl">ACCESS DENIED</h1>
            <p className="font-mono text-sm">Security clearance insufficient. Incident reported.</p>
            <Navigate to="/" replace />
        </div>
    );
  }

  return <>{children}</>;
};