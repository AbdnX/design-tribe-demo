import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorker } from "../data/mockData";
import { translations } from "../i18n/translations";
import { DEFAULT_LANGUAGE } from "../i18n/languages";

const KioskContext = createContext(null);

const IDLE_LIMIT_MS = 60_000; // auto-lock like an ATM when nobody is using the kiosk
const LANGUAGE_STORAGE_KEY = "kiosk.language";
const VOICE_GUIDANCE_STORAGE_KEY = "kiosk.voiceGuidance";

// Voices installed on kiosk hardware vary a lot, so this is a best-effort
// hint — speechSynthesis falls back to a default voice when no exact match
// for the language is installed.
const SPEECH_LANG = {
  en: "en-US",
  fr: "fr-FR",
  yo: "yo-NG",
  ha: "ha-NG",
  ig: "ig-NG",
};

export function KioskProvider({ children }) {
  const [worker, setWorker] = useState(null);
  const [language, setLanguageState] = useState(
    () => localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE,
  );
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [outputEntries, setOutputEntries] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [problemReports, setProblemReports] = useState([]);
  const [voiceGuidance, setVoiceGuidanceState] = useState(
    () => localStorage.getItem(VOICE_GUIDANCE_STORAGE_KEY) === "true",
  );
  const [idleWarning, setIdleWarning] = useState(false);

  const navigate = useNavigate();
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const setLanguage = useCallback((code) => {
    setLanguageState(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  }, []);

  const setVoiceGuidance = useCallback((enabled) => {
    setVoiceGuidanceState(enabled);
    localStorage.setItem(VOICE_GUIDANCE_STORAGE_KEY, String(enabled));
    if (!enabled) window.speechSynthesis?.cancel();
  }, []);

  const speak = useCallback(
    (text) => {
      if (!voiceGuidance || !text || typeof window === "undefined" || !window.speechSynthesis) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const bcp47 = SPEECH_LANG[language] || SPEECH_LANG[DEFAULT_LANGUAGE];
      utterance.lang = bcp47;
      const match = voicesRef.current.find((v) => v.lang === bcp47) || voicesRef.current.find((v) => v.lang?.startsWith(language));
      if (match) utterance.voice = match;
      utterance.rate = 0.95;
      synth.speak(utterance);
    },
    [voiceGuidance, language],
  );

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  const t = useCallback(
    (key, vars) => {
      let str = translations[language]?.[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          str = str.replaceAll(`{{${name}}}`, value);
        }
      }
      return str;
    },
    [language],
  );

  const login = useCallback(
    (employeeId) => {
      const found = getWorker(employeeId);
      if (!found) return { ok: false, error: t("login.errorNotFound") };
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
    [navigate, t],
  );

  const endSession = useCallback(() => {
    window.speechSynthesis?.cancel();
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
      language,
      setLanguage,
      t,
      setVoiceGuidance,
      speak,
      cancelSpeech,
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
      language,
      setLanguage,
      t,
      setVoiceGuidance,
      speak,
      cancelSpeech,
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
