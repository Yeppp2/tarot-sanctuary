import { DrawnCard } from '@/lib/tarot/draw';
import { ReadingContext } from '@/lib/tarot/context';

export interface ReadingRecord {
  id: string;
  question: string;
  spreadType: string;
  cards: DrawnCard[];
  reading: string;
  context?: ReadingContext;
  timestamp: number;
}

const STORAGE_KEY = 'tarot-history';
const HISTORY_EVENT = 'tarot-history-change';
let cachedRaw: string | null | undefined;
let cachedHistory: ReadingRecord[] = [];

function emitHistoryChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(HISTORY_EVENT));
}

export function subscribeHistory(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleChange = () => listener();
  window.addEventListener(HISTORY_EVENT, handleChange);
  window.addEventListener('storage', handleChange);

  return () => {
    window.removeEventListener(HISTORY_EVENT, handleChange);
    window.removeEventListener('storage', handleChange);
  };
}

export function getHistory(): ReadingRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedHistory;

    cachedRaw = raw;
    cachedHistory = raw ? JSON.parse(raw) : [];
    return cachedHistory;
  } catch {
    cachedRaw = undefined;
    cachedHistory = [];
    return [];
  }
}

function setHistory(history: ReadingRecord[]) {
  if (history.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
  } else {
    cachedRaw = JSON.stringify(history);
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  }

  cachedHistory = history;
  emitHistoryChange();
}

export function saveReading(record: ReadingRecord): void {
  const history = [...getHistory()];
  history.unshift(record);
  // Keep only last 50 readings
  if (history.length > 50) history.length = 50;
  setHistory(history);
}

export function getReadingById(id: string): ReadingRecord | undefined {
  return getHistory().find(r => r.id === id);
}

export function updateReading(record: ReadingRecord): void {
  const history = [...getHistory()];
  const index = history.findIndex(r => r.id === record.id);
  if (index === -1) {
    saveReading(record);
    return;
  }
  history[index] = record;
  setHistory(history);
}

export function deleteReading(id: string): void {
  const history = getHistory().filter(r => r.id !== id);
  setHistory(history);
}

export function clearHistory(): void {
  setHistory([]);
}
