import { SQLite } from "../database/SQLite.ts";

const db = new SQLite();

db.query(`
  CREATE TABLE IF NOT EXISTS swiss_law_books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL UNIQUE
  )
`);

db.query(`
  CREATE VIRTUAL TABLE IF NOT EXISTS swiss_law_embeddings USING vec0(
    id INTEGER PRIMARY KEY,
    embedding float[768]
  )
`);

db.query(`
  CREATE TABLE IF NOT EXISTS swiss_law_chapters (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding_id INTEGER
  )
`);
