import { component$, useStore, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Header } from "~/components/Header";
import { NotesList } from "~/components/NotesList";
import { NoteEditor } from "~/components/NoteEditor";
import { NoteViewer } from "~/components/NoteViewer";
import type { Note, NotePayload } from "~/types/note";
import * as api from "~/services/notes";

// PUBLIC_INTERFACE
export default component$(() => {
  // The "store" maintains application state for notes and UI
  const store = useStore<{
    notes: Note[];
    selected: string | null;
    showEditor: boolean;
    editorNote: Note | null;
    loading: boolean;
    error: string | null;
    firstLoad: boolean;
  }>({
    notes: [],
    selected: null,
    showEditor: false,
    editorNote: null,
    loading: false,
    error: null,
    firstLoad: true,
  });

  // Fetch notes on mount
  useVisibleTask$(async () => {
    store.loading = true;
    try {
      store.notes = await api.fetchNotes();
      if (store.notes.length > 0) {
        store.selected = store.notes[0].id;
      }
      store.error = null;
    } catch (e: any) {
      store.error = "Unable to fetch notes (API not available?)";
    }
    store.loading = false;
    store.firstLoad = false;
  });

  // Event handlers must be serializable in Qwik. Use $() to wrap handlers.
  const onSelect = $((id: string) => {
    store.selected = id;
    store.showEditor = false;
    store.editorNote = null;
  });

  const onNew = $(() => {
    store.showEditor = true;
    store.editorNote = null;
  });

  const onEdit = $(() => {
    if (!store.selected) return;
    const note = store.notes.find((n) => n.id === store.selected) || null;
    store.editorNote = note;
    store.showEditor = true;
  });

  const onSave = $(async (payload: NotePayload) => {
    store.loading = true;
    try {
      let saved: Note;
      if (store.editorNote) {
        saved = await api.updateNote(store.editorNote.id, payload);
        store.notes = store.notes.map((n) =>
          n.id === saved.id ? saved : n
        );
        store.selected = saved.id;
      } else {
        saved = await api.addNote(payload);
        store.notes = [saved, ...store.notes];
        store.selected = saved.id;
      }
      store.showEditor = false;
      store.editorNote = null;
      store.error = null;
    } catch (e: any) {
      store.error = "Error saving note: " + (e.message || e.toString());
    }
    store.loading = false;
  });

  const onDelete = $(async (id: string) => {
    store.loading = true;
    try {
      await api.deleteNote(id);
      store.notes = store.notes.filter((n) => n.id !== id);
      if (store.selected === id) {
        store.selected = store.notes.length > 0 ? store.notes[0].id : null;
        store.showEditor = false;
        store.editorNote = null;
      }
      store.error = null;
    } catch (e: any) {
      store.error = "Error deleting note";
    }
    store.loading = false;
  });

  // The currently selected note for viewing
  const selectedNote =
    store.selected && store.notes
      ? store.notes.find((n) => n.id === store.selected) || null
      : null;

  return (
    <div class="notes-app">
      <Header />
      <main class="main-area">
        <NotesList
          notes={store.notes}
          selectedId={store.selected}
          onSelect$={onSelect}
          onDelete$={onDelete}
        />
        <section class="editor-section">
          <div class="editor-header">
            {store.showEditor ? (
              <>
                <span />
                <button class="secondary-btn" type="button" onClick$={$(() => { store.showEditor = false; store.editorNote = null; })}>Cancel</button>
              </>
            ) : (
              <>
                <button
                  class="primary-btn"
                  type="button"
                  onClick$={onNew}
                  disabled={store.loading}
                >
                  + New Note
                </button>
                {selectedNote && (
                  <button class="secondary-btn" type="button" onClick$={onEdit}>
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
          <div class="editor-main">
            {store.loading && <div class="loading">Loading...</div>}
            {store.error && <div class="form-error">{store.error}</div>}
            {!store.showEditor && selectedNote && (
              <NoteViewer note={selectedNote} onEdit$={onEdit} />
            )}
            {!store.showEditor && !selectedNote && !store.firstLoad && (
              <div class="empty-note-msg">No notes yet. Click "New Note" to get started!</div>
            )}
            {store.showEditor && (
              <NoteEditor
                note={store.editorNote}
                loading={store.loading}
                onSave$={onSave}
                onCancel$={$(() => { store.showEditor = false; store.editorNote = null; })}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "QwikNotes",
  meta: [
    {
      name: "description",
      content: "Simple Qwik notes app (minimalistic, light theme, CRUD)",
    },
  ],
};
