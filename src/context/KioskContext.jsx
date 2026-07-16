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

// Browsers expose a grab-bag of voices of wildly different quality under the
// same API — including OS "novelty" sound-effect voices (Zarvox, Bad News,
// Bahh...) that speechSynthesis makes no effort to separate from real ones.
// This ranks candidates so we pick something that actually sounds like
// natural speech instead of whatever the OS lists first.
const NOVELTY_VOICE_NAMES = new Set([
  "albert", "bad news", "bahh", "bells", "boing", "bubbles", "cellos",
  "good news", "jester", "organ", "superstar", "trinoids", "whisper",
  "wobble", "zarvox", "bruce",
]);
const LEGACY_ROBOTIC_VOICE_NAMES = new Set(["fred", "ralph", "kathy", "junior", "princess"]);
const KNOWN_NATURAL_VOICE_NAMES = new Set([
  "samantha", "alex", "ava", "susan", "allison", "nicky", "zoe", "tom",
  "karen", "moira", "tessa", "fiona", "victoria", "daniel", "serena",
  "thomas", "jacques", "amélie", "amelie", "anna", "marie",
]);

function scoreVoice(voice) {
  const rawName = voice.name;
  const bareName = rawName
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, "")
    .trim();
  let score = 0;
  if (!voice.localService) score += 3; // networked voices (e.g. Chrome's Google voices) are usually higher fidelity
  if (/neural|natural/i.test(rawName)) score += 6;
  if (/premium|enhanced|plus/i.test(rawName)) score += 4;
  if (/google/i.test(rawName)) score += 4;
  if (KNOWN_NATURAL_VOICE_NAMES.has(bareName)) score += 2;
  if (/\(.+\)/.test(rawName)) score += 1; // Apple's modern cross-language persona voices (Eddy, Flo, Reed, Shelley, ...)
  if (NOVELTY_VOICE_NAMES.has(bareName)) score -= 8;
  if (LEGACY_ROBOTIC_VOICE_NAMES.has(bareName)) score -= 4;
  if (/compact/i.test(rawName)) score -= 4; // Apple's lowest-quality tier, explicitly labeled
  if (voice.default) score += 1;
  return score;
}

function pickBestVoice(voices, bcp47, language) {
  const exact = voices.filter((v) => v.lang === bcp47);
  const sameLanguage = voices.filter((v) => v.lang?.toLowerCase().startsWith(language));
  const candidates = exact.length ? exact : sameLanguage;
  if (!candidates.length) return null;
  return [...candidates].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

// Browser/OS speech synthesis has essentially no real voices for these —
// route them to the Spitch proxy (server/index.js) instead, which has
// production voices built specifically for Nigerian languages.
const SPITCH_LANGUAGES = new Set(["yo", "ha", "ig"]);
const spitchAudioCache = new Map(); // `${language}:${text}` -> object URL, avoids re-billing repeat lines

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
  const currentAudioRef = useRef(null);

  const stopAllSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  }, []);

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

  const setVoiceGuidance = useCallback(
    (enabled) => {
      setVoiceGuidanceState(enabled);
      localStorage.setItem(VOICE_GUIDANCE_STORAGE_KEY, String(enabled));
      if (!enabled) stopAllSpeech();
    },
    [stopAllSpeech],
  );

  const speakWithSpitch = useCallback(async (text, language) => {
    const cacheKey = `${language}:${text}`;
    let url = spitchAudioCache.get(cacheKey);
    if (!url) {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language }),
        });
        if (!res.ok) throw new Error(`TTS proxy responded ${res.status}`);
        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        spitchAudioCache.set(cacheKey, url);
      } catch (err) {
        console.error("Spitch voice guidance failed:", err);
        return;
      }
    }
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    audio.play().catch((err) => console.error("Audio playback failed:", err));
  }, []);

  const speak = useCallback(
    (text) => {
      if (!voiceGuidance || !text) return;
      stopAllSpeech();

      if (SPITCH_LANGUAGES.has(language)) {
        speakWithSpitch(text, language);
        return;
      }

      if (typeof window === "undefined" || !window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(text);
      const bcp47 = SPEECH_LANG[language] || SPEECH_LANG[DEFAULT_LANGUAGE];
      utterance.lang = bcp47;
      const best = pickBestVoice(voicesRef.current, bcp47, language);
      if (best) utterance.voice = best;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    },
    [voiceGuidance, language, stopAllSpeech, speakWithSpitch],
  );

  const cancelSpeech = stopAllSpeech;

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
    stopAllSpeech();
    setWorker(null);
    setClockedIn(false);
    setClockInTime(null);
    setOutputEntries([]);
    setLeaveRequests([]);
    setLoanRequests([]);
    setProblemReports([]);
    setIdleWarning(false);
    navigate("/");
  }, [navigate, stopAllSpeech]);

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
