import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  type PropFunction,
} from "@builder.io/qwik";
import type { Note, NotePayload } from "~/types/note";

type Props = {
  note?: Note | null;
  loading?: boolean;
  onSave$: PropFunction<(data: NotePayload) => Promise<void>>;
  onCancel$?: PropFunction<() => void>;
};

export const NoteEditor = component$((props: Props) => {
  const title = useSignal(props.note?.title || "");
  const content = useSignal(props.note?.content || "");
  const error = useSignal<string | null>(null);

  useVisibleTask$(({ track }) => {
    // When note changes reset title/content
    track(() => props.note);
    title.value = props.note?.title || "";
    content.value = props.note?.content || "";
    error.value = null;
  });

  // PUBLIC_INTERFACE
  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    if (!title.value.trim()) {
      error.value = "Title is required";
      return;
    }
    error.value = null;
    props.onSave$({
      title: title.value,
      content: content.value,
    });
    if (!props.note) {
      title.value = "";
      content.value = "";
    }
  });

  return (
    <form class="note-editor" onSubmit$={handleSubmit} preventdefault:submit>
      <h2>{props.note ? "Edit Note" : "New Note"}</h2>
      {error.value && <div class="form-error">{error.value}</div>}
      <input
        class="note-title-input"
        type="text"
        value={title.value}
        onInput$={(e) => (title.value = (e.target as HTMLInputElement).value)}
        placeholder="Title"
        disabled={props.loading}
        autoFocus
      />
      <textarea
        class="note-content-input"
        value={content.value}
        onInput$={(e) => (content.value = (e.target as HTMLTextAreaElement).value)}
        placeholder="Write your note here..."
        rows={10}
        disabled={props.loading}
      />
      <div class="note-editor-actions">
        {props.onCancel$ && (
          <button
            type="button"
            class="secondary-btn"
            onClick$={props.onCancel$}
            disabled={props.loading}
          >
            Cancel
          </button>
        )}
        <button type="submit" class="save-btn" disabled={props.loading}>
          {props.loading ? "Saving..." : props.note ? "Save" : "Add Note"}
        </button>
      </div>
    </form>
  );
});
