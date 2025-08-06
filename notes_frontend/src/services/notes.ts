import type { Note, NotePayload } from "~/types/note";

const BASE_API = import.meta.env.VITE_NOTES_API_URL || "/api/notes"; // fallback for dev

// PUBLIC_INTERFACE
/**
 * Fetch all notes from the backend API.
 */
export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(BASE_API);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Fetch a single note by ID.
 */
export async function fetchNote(id: string): Promise<Note> {
  const res = await fetch(`${BASE_API}/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Failed to fetch note");
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Add a new note to the backend.
 */
export async function addNote(note: NotePayload): Promise<Note> {
  const res = await fetch(BASE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to add note");
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Update an existing note.
 */
export async function updateNote(id: string, note: NotePayload): Promise<Note> {
  const res = await fetch(`${BASE_API}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Delete a note by ID.
 */
export async function deleteNote(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_API}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}
