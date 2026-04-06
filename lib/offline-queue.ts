const QUEUE_KEY = "fln_offline_queue";
const HIERARCHY_KEY = "fln_hierarchy_cache";

export type OfflineAssessment = {
  localId: string;
  savedAt: string;
  studentId: string | null;
  newStudent?: { name: string; classNum: number; gender: string; schoolId: string };
  assessorName: string;
  literacyLevel: number;
  numeracyLevel: number;
  addition: boolean;
  subtraction: boolean;
  multiplication: boolean;
  division: boolean;
  // For display only
  studentName?: string;
  schoolName?: string;
};

export function getQueue(): OfflineAssessment[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToQueue(item: Omit<OfflineAssessment, "localId" | "savedAt">): void {
  const queue = getQueue();
  queue.push({ ...item, localId: crypto.randomUUID(), savedAt: new Date().toISOString() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function removeFromQueue(localId: string): void {
  const queue = getQueue().filter((i) => i.localId !== localId);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}

export function saveHierarchyCache(hierarchy: any[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HIERARCHY_KEY, JSON.stringify(hierarchy));
}

export function getHierarchyCache(): any[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HIERARCHY_KEY) || "[]");
  } catch {
    return [];
  }
}
