// Hook for TTS
import { useRef } from "react";

export function useSpeechSynthesis() {
  const synthRef = useRef(window.speechSynthesis);

  const speak = (text: string, lang: string = "en-US", rate: number = 1) => {
    if ("speechSynthesis" in window) {
      synthRef.current.cancel(); // Stop any current speech
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate; // 0.1 (slowest) to 10 (fastest), default 1
      synthRef.current.speak(utterance);
    }
  };

  const stop = () => {
    if ("speechSynthesis" in window) {
      synthRef.current.cancel();
    }
  };

  return { speak, stop };
}
