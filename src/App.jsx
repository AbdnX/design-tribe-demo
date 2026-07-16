import { Routes, Route } from "react-router-dom";
import { KioskProvider } from "./context/KioskContext";
import KioskLayout from "./components/KioskLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Shift from "./pages/Shift";
import LogOutput from "./pages/LogOutput";
import Leave from "./pages/Leave";
import Benefits from "./pages/Benefits";
import Loans from "./pages/Loans";
import ReportProblem from "./pages/ReportProblem";
import Recognition from "./pages/Recognition";
import Payslips from "./pages/Payslips";
import HRUpdates from "./pages/HRUpdates";

function App() {
  return (
    <KioskProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<KioskLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shift" element={<Shift />} />
          <Route path="/log-output" element={<LogOutput />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/report-problem" element={<ReportProblem />} />
          <Route path="/recognition" element={<Recognition />} />
          <Route path="/payslips" element={<Payslips />} />
          <Route path="/hr-updates" element={<HRUpdates />} />
        </Route>
      </Routes>
    </KioskProvider>
  );
}

export default App;
