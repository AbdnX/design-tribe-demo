import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorker } from "../data/mockData";

const KioskContext = createContext(null);

const IDLE_LIMIT_MS = 60_000; // auto-lock like an ATM when nobody is using the kiosk

export function KioskProvider({ children }) {
  const [worker, setWorker] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [outputEntries, setOutputEntries] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [problemReports, setProblemReports] = useState([]);
  const [voiceGuidance, setVoiceGuidance] = useState(false);
  const [idleWarning, setIdleWarning] = useState(false);

  const navigate = useNavigate();
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  const login = useCallback(
    (employeeId) => {
      const found = getWorker(employeeId);
      if (!found) return { ok: false, error: "We couldn't find that Employee ID. Please check and try again." };
      setWorker(found);
      setClockedIn(false);
      setClockInTime(null);
      setOutputEntries([]);
      setLeaveRequests([]);
      setLoanRequests([]);
      setProblemReports([]);
      navigate("/dashboard");
      return { ok: true };
    },
    [navigate],
  );

  const endSession = useCallback(() => {
    setWorker(null);
    setClockedIn(false);
    setClockInTime(null);
    setOutputEntries([]);
    setLeaveRequests([]);
    setLoanRequests([]);
    setProblemReports([]);
    setIdleWarning(false);
    navigate("/");
  }, [navigate]);

  const clockIn = useCallback(() => {
    setClockedIn(true);
    setClockInTime(new Date());
  }, []);

  const clockOut = useCallback(() => {
    setClockedIn(false);
  }, []);

  const addOutputEntry = useCallback((entry) => {
    setOutputEntries((prev) => [{ ...entry, id: crypto.randomUUID(), time: new Date() }, ...prev]);
  }, []);

  const addLeaveRequest = useCallback((entry) => {
    setLeaveRequests((prev) => [{ ...entry, id: crypto.randomUUID(), submittedAt: new Date(), status: "Pending" }, ...prev]);
  }, []);

  const addLoanRequest = useCallback((entry) => {
    setLoanRequests((prev) => [{ ...entry, id: crypto.randomUUID(), submittedAt: new Date(), status: "Pending" }, ...prev]);
  }, []);

  const addProblemReport = useCallback((entry) => {
    setProblemReports((prev) => [{ ...entry, id: crypto.randomUUID(), submittedAt: new Date(), status: "Submitted" }, ...prev]);
  }, []);

  // Idle detection — only matters once someone is logged in, mirroring an ATM
  // that returns to the welcome screen after inactivity.
  const resetIdleTimer = useCallback(() => {
    if (!worker) return;
    setIdleWarning(false);
    clearTimeout(idleTimerRef.current);
    clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => setIdleWarning(true), IDLE_LIMIT_MS - 10_000);
    idleTimerRef.current = setTimeout(() => endSession(), IDLE_LIMIT_MS);
  }, [worker, endSession]);

  useEffect(() => {
    if (!worker) {
      clearTimeout(idleTimerRef.current);
      clearTimeout(warningTimerRef.current);
      return;
    }
    resetIdleTimer();
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    const handler = () => resetIdleTimer();
    events.forEach((e) => window.addEventListener(e, handler));
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      clearTimeout(idleTimerRef.current);
      clearTimeout(warningTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker]);

  const value = useMemo(
    () => ({
      worker,
      clockedIn,
      clockInTime,
      outputEntries,
      leaveRequests,
      loanRequests,
      problemReports,
      voiceGuidance,
      idleWarning,
      setVoiceGuidance,
      login,
      endSession,
      clockIn,
      clockOut,
      addOutputEntry,
      addLeaveRequest,
      addLoanRequest,
      addProblemReport,
      staySignedIn: resetIdleTimer,
    }),
    [
      worker,
      clockedIn,
      clockInTime,
      outputEntries,
      leaveRequests,
      loanRequests,
      problemReports,
      voiceGuidance,
      idleWarning,
      login,
      endSession,
      clockIn,
      clockOut,
      addOutputEntry,
      addLeaveRequest,
      addLoanRequest,
      addProblemReport,
      resetIdleTimer,
    ],
  );

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
}

export function useKiosk() {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error("useKiosk must be used within KioskProvider");
  return ctx;
}
