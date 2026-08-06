"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const WARNING_BEFORE_MS = 30 * 1000;
export const LAST_ACTIVITY_KEY = "tradehub_last_activity";
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

function readLastActivity(): number {
  const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
  return raw ? Number(raw) : Date.now();
}

function writeLastActivity(timestamp: number) {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
}

export function SessionWatcher() {
  const { status } = useSession();
  const router = useRouter();

  const [showWarning, setShowWarning] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_BEFORE_MS / 1000);

  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastThrottledWrite = useRef(0);

  const clearAllTimers = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (expireTimer.current) clearTimeout(expireTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  }, []);

  const expireNow = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    setShowExpired(true);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    signOut({ redirect: false });
  }, [clearAllTimers]);

  const scheduleFromIdleAmount = useCallback(
    (alreadyIdleMs: number) => {
      clearAllTimers();

      const msUntilExpire = IDLE_TIMEOUT_MS - alreadyIdleMs;
      if (msUntilExpire <= 0) {
        expireNow();
        return;
      }

      const msUntilWarning = msUntilExpire - WARNING_BEFORE_MS;

      if (msUntilWarning <= 0) {
        setShowWarning(true);
        setSecondsLeft(Math.ceil(msUntilExpire / 1000));
        countdownInterval.current = setInterval(() => {
          setSecondsLeft((s) => Math.max(0, s - 1));
        }, 1000);
      } else {
        warningTimer.current = setTimeout(() => {
          setShowWarning(true);
          setSecondsLeft(WARNING_BEFORE_MS / 1000);
          countdownInterval.current = setInterval(() => {
            setSecondsLeft((s) => Math.max(0, s - 1));
          }, 1000);
        }, msUntilWarning);
      }

      expireTimer.current = setTimeout(expireNow, msUntilExpire);
    },
    [clearAllTimers, expireNow],
  );

  const resetActivity = useCallback(() => {
    writeLastActivity(Date.now());
    setShowWarning(false);
    scheduleFromIdleAmount(0);
  }, [scheduleFromIdleAmount]);

  useEffect(() => {
    if (status !== "authenticated") {
      clearAllTimers();
      return;
    }

    function checkElapsedTime() {
      const idleMs = Date.now() - readLastActivity();
      if (idleMs >= IDLE_TIMEOUT_MS) {
        expireNow();
      } else {
        scheduleFromIdleAmount(idleMs);
      }
    }

    checkElapsedTime();
    document.addEventListener("visibilitychange", checkElapsedTime);

    function onActivity() {
      const now = Date.now();
      if (now - lastThrottledWrite.current < 5000) return;
      lastThrottledWrite.current = now;
      resetActivity();
    }

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, onActivity));

    return () => {
      document.removeEventListener("visibilitychange", checkElapsedTime);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, onActivity));
      clearAllTimers();
    };
  }, [status, expireNow, scheduleFromIdleAmount, resetActivity, clearAllTimers]);

  useEffect(() => {
    if (!showExpired) return;
    const timer = setTimeout(() => {
      setShowExpired(false);
      if (window.location.pathname !== "/login") {
        router.push("/login");
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [showExpired, router]);

  function handleSignInAgain() {
    setShowExpired(false);
    if (window.location.pathname !== "/login") {
      router.push("/login");
    }
  }

  return (
    <>
      <Dialog open={showWarning} onOpenChange={(open) => !open && resetActivity()}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-seal/10">
              <Clock className="h-6 w-6 text-seal" />
            </div>
            <DialogTitle>Are you still there?</DialogTitle>
            <DialogDescription>
              You&apos;ve been inactive for a while. For your security, you&apos;ll be
              signed out in{" "}
              <span className="font-semibold text-foreground">{secondsLeft}s</span>{" "}
              unless you stay active.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={expireNow}>
              Sign out now
            </Button>
            <Button onClick={resetActivity}>Stay signed in</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExpired} onOpenChange={(open) => !open && handleSignInAgain()}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle>Session expired</DialogTitle>
            <DialogDescription>
              You were signed out after 5 minutes of inactivity. Please sign in
              again to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSignInAgain}>Sign in again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}