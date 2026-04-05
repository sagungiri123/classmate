import { useState, useEffect, useRef } from "react";

// Professional SVG Icons
const MicIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const RecordingIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
  </svg>
);

export default function MicButton({ onTranscript }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false; // set true for live preview
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript); // pass text up to parent
      setListening(false);
    };

    recognition.onerror = (e) => {
      setError(e.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setError(null);
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        disabled={!!error}
        className={`shrink-0 w-10 h-10 flex items-center justify-center transition-all duration-200 ${
          listening
            ? "bg-red-500 text-white animate-pulse"
            : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
        style={{ borderRadius: "10px" }}
        title={listening ? "Stop listening" : "Click to speak"}
      >
        {listening ? (
          <RecordingIcon className="w-5 h-5" />
        ) : (
          <MicIcon className="w-5 h-5" />
        )}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}