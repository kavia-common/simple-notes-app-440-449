import { component$ } from "@builder.io/qwik";
import type { Note } from "~/types/note";

type Props = {
  note: Note;
  onEdit$: () => void;
};

export const NoteViewer = component$((props: Props) => (
  <div class="note-viewer">
    <div class="note-viewer-header">
      <h2>{props.note.title || "(untitled)"}</h2>
      <button class="edit-btn" onClick$={props.onEdit$}>Edit</button>
    </div>
    <div class="note-viewer-meta">
      <span>
        Last updated: {new Date(props.note.updated_at).toLocaleString()}
      </span>
    </div>
    <div class="note-viewer-content">
      <pre>{props.note.content || <em>No content</em>}</pre>
    </div>
  </div>
));
