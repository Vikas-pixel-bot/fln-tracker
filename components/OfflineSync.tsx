"use client";

import { useEffect, useState, useTransition } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { getQueue, removeFromQueue } from "@/lib/offline-queue";
import { createStudent, createAssessment } from "@/app/actions";

export default function OfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [synced, setSynced] = useState(false);
  const [isPending, startTransition] = useTransition();

  function refreshCount() {
    setPendingCount(getQueue().length);
  }

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
    }

    setIsOnline(navigator.onLine);
    refreshCount();

    const handleOnline = () => { setIsOnline(true); refreshCount(); };
    const handleOffline = () => { setIsOnline(false); refreshCount(); };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    // Refresh count when storage changes (assessment saved in another tab/component)
    window.addEventListener("fln_queue_updated", refreshCount);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("fln_queue_updated", refreshCount);
    };
  }, []);

  function handleSync() {
    startTransition(async () => {
      const queue = getQueue();
      for (const item of queue) {
        try {
          let finalStudentId = item.studentId;
          if (!finalStudentId && item.newStudent) {
            const s = await createStudent(item.newStudent);
            finalStudentId = s.id;
          }
          if (!finalStudentId) continue;

          await createAssessment({
            studentId: finalStudentId,
            assessorName: item.assessorName,
            literacyLevel: item.literacyLevel,
            numeracyLevel: item.numeracyLevel,
            addition: item.addition,
            subtraction: item.subtraction,
            multiplication: item.multiplication,
            division: item.division,
          });
          removeFromQueue(item.localId);
        } catch (e) {
          console.error("Sync failed for item", item.localId, e);
        }
      }
      refreshCount();
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    });
  }

  // Nothing to show when online and no pending items
  if (isOnline && pendingCount === 0 && !synced) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
      !isOnline
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
        : synced
        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
    }`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline{pendingCount > 0 ? ` · ${pendingCount} queued` : ""}</span>
        </>
      ) : synced ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Synced!</span>
        </>
      ) : pendingCount > 0 ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>{pendingCount} pending</span>
          <button
            onClick={handleSync}
            disabled={isPending}
            className="flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-full hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isPending ? "animate-spin" : ""}`} />
            {isPending ? "Syncing..." : "Sync"}
          </button>
        </>
      ) : null}
    </div>
  );
}
