import { useState } from "react";

/**
 * Honeypot hook for bot protection
 * Bots typically fill all form fields, including hidden ones
 * If the honeypot field has a value, the form submission is likely from a bot
 */
export function useHoneypot() {
  const [honeypotValue, setHoneypotValue] = useState("");

  const isBot = () => {
    return honeypotValue.length > 0;
  };

  const honeypotProps = {
    value: honeypotValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setHoneypotValue(e.target.value),
    name: "website", // Common field name that bots target
    autoComplete: "off",
    tabIndex: -1,
    "aria-hidden": true as const,
    style: {
      position: "absolute" as const,
      left: "-9999px",
      opacity: 0,
      height: 0,
      width: 0,
      overflow: "hidden",
    },
  };

  const reset = () => {
    setHoneypotValue("");
  };

  return {
    isBot,
    honeypotProps,
    reset,
  };
}
