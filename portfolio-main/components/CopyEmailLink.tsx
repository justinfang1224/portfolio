"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { TermExplain } from "./TermExplain";

type CopyEmailLinkProps = {
  children?: ReactNode;
  className?: string;
  email: string;
};

const DEFAULT_HINT = "Copy email";
const COPIED_HINT = "Copied ✅";
const COPIED_DURATION_MS = 2000;

function shouldOpenMailClient() {
  return (
    window.matchMedia("(max-width: 767px)").matches ||
    window.matchMedia("(hover: none)").matches
  );
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function CopyEmailLink({ children = "Email", className, email }: CopyEmailLinkProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current != null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldOpenMailClient()) {
      return;
    }

    event.preventDefault();

    try {
      await copyText(email);
      setCopied(true);

      if (resetTimerRef.current != null) {
        clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = setTimeout(() => {
        setCopied(false);
        resetTimerRef.current = null;
      }, COPIED_DURATION_MS);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  function handleMouseLeave(event: MouseEvent<HTMLAnchorElement>) {
    // Blur so the tip can dismiss, but keep "Copied ✅" through the exit motion.
    // Label resets only after the 2s copied window.
    event.currentTarget.blur();
  }

  return (
    <TermExplain asChild explanation={copied ? COPIED_HINT : DEFAULT_HINT}>
      <a
        className={className}
        href={`mailto:${email}`}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    </TermExplain>
  );
}
