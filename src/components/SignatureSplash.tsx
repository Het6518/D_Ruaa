import React, { useState, useEffect } from "react";

interface SignatureSplashProps {
  onComplete?: () => void;
  duration?: number;
}

export function SignatureSplash({ onComplete, duration = 4000 }: SignatureSplashProps) {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out slightly before removing completely
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, Math.max(500, duration - 700));

    const removeTimer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#26170f] transition-opacity duration-700 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative max-w-lg w-[85%] sm:w-[70%] md:w-[50%] flex flex-col items-center justify-center p-6 text-center">
        <img
          src="/signature.gif"
          alt="Fragrances by D_Ruaa Signature Reveal"
          className="w-full max-h-[75vh] object-contain drop-shadow-sm"
        />
      </div>
    </div>
  );
}
