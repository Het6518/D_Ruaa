import React from "react";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ fullPage = false, message = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center">
        {/* Animated spinning gold ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-2 border-clay/20 border-t-clay animate-spin`}
        />
        {/* Pulsing centered brand logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/logo.jpeg"
            alt="D'Ruaa Logo"
            className="w-2/3 h-2/3 object-contain rounded-full animate-pulse shadow-sm"
          />
        </div>
      </div>
      {message && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center bg-ivory">
        {content}
      </div>
    );
  }

  return content;
}
