/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOTES_API_URL: string; // URL of the notes backend API, should be set in .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
