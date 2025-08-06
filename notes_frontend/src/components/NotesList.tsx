import { component$, useSignal, type PropFunction } from "@builder.io/qwik";
import type { Note } from "~/types/note";

type Props = {
  notes: Note[];
  selectedId: string | null;
  onSelect$: PropFunction<(id: string) => void>;
  onDelete$: PropFunction<(id: string) => void>;
};

export const NotesList = component$((props: Props) => {
  const confirmId = useSignal<string | null>(null);

  return (
    <aside class="notes-list">
      <div class="notes-list-header">
        <h2>Notes</h2>
      </div>
      <ul>
        {props.notes.map((note) => (
          <li
            key={note.id}
            class={{
              selected: props.selectedId === note.id,
              "note-list-item": true,
            }}
            onClick$={() => props.onSelect$(note.id)}
            tabIndex={0}
            aria-selected={props.selectedId === note.id}
          >
            <div class="note-title-line">
              <span class="note-title">{note.title || "(untitled)"}</span>
              <button
                class="delete-btn"
                aria-label="Delete note"
                tabIndex={-1}
                onClick$={async (e) => {
                  e.stopPropagation();
                  confirmId.value === note.id
                    ? await props.onDelete$(note.id)
                    : (confirmId.value = note.id);
                }}
                style={confirmId.value === note.id ? { background: "var(--accent-color)" } : {}}
              >
                {confirmId.value === note.id ? "Confirm" : "🗑️"}
              </button>
            </div>
            <div class="note-date">
              {new Date(note.updated_at).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
});
