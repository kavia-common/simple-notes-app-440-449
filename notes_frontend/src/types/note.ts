export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
};

export type NotePayload = {
  title: string;
  content: string;
};
