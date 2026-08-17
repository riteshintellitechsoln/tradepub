const SAVED_BOOKS_KEY = "tradehub:saved-books";
export const SAVED_BOOKS_EVENT = "tradehub:saved-books-changed";

export interface SavedBookEntry {
  url: string;
  title: string;
  savedAt: number;
}

export function readSavedBooks(): SavedBookEntry[] {
  try {
    const raw = window.localStorage.getItem(SAVED_BOOKS_KEY);
    const entries = raw ? (JSON.parse(raw) as SavedBookEntry[]) : [];
    return entries.sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}

function writeSavedBooksRaw(entries: SavedBookEntry[]) {
  window.localStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(SAVED_BOOKS_EVENT));
}

export function isBookSaved(url: string): boolean {
  return readSavedBooks().some((entry) => entry.url === url);
}

export function toggleSavedBook(entry: { url: string; title: string }): boolean {
  const current = readSavedBooks();
  const alreadySaved = current.some((e) => e.url === entry.url);

  if (alreadySaved) {
    writeSavedBooksRaw(current.filter((e) => e.url !== entry.url));
    return false;
  }
  writeSavedBooksRaw([...current, { ...entry, savedAt: Date.now() }]);
  return true;
}

export function removeSavedBook(url: string) {
  writeSavedBooksRaw(readSavedBooks().filter((e) => e.url !== url));
}