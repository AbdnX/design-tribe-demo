import { Navigate, Outlet } from "react-router-dom";
import { useKiosk } from "../context/KioskContext";
import KioskHeader from "./KioskHeader";
import IdleWarningModal from "./IdleWarningModal";

export default function KioskLayout() {
  const { worker } = useKiosk();

  if (!worker) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <KioskHeader />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
      <IdleWarningModal />
    </div>
  );
}
