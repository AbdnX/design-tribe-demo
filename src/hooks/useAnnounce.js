import { useEffect } from "react";
import { useKiosk } from "../context/KioskContext";

// Speaks `text` whenever it changes (page mount, or the language flips while
// voice guidance is on). No-ops silently when voice guidance is off.
export function useAnnounce(text) {
  const { speak } = useKiosk();
  useEffect(() => {
    speak(text);
  }, [text, speak]);
}
