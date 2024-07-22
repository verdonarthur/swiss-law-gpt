CREATE EXTENSION vector;

CREATE TABLE swiss_law_books (
    id bigserial PRIMARY KEY,
    title varchar(255)
);

/* 1536 is the number of dimensions output by text-embedding-3-small model */
/* 3072 is the number of dimensions output by text-embedding-3-large model */
CREATE TABLE swiss_law_embeddings (
    id bigserial PRIMARY KEY,
    content text,
    embedding vector(1536),
    book_id bigserial REFERENCES swiss_law_books ON DELETE RESTRICT
);

CREATE INDEX ON swiss_law_embeddings USING ivfflat (embedding vector_cosine_ops)
with
  (lists = 100);

CREATE OR REPLACE FUNCTION match_swiss_law (
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id bigint,
    content text,
    similarity float
)
AS $$
    SELECT
        swiss_law_embeddings.id,
        swiss_law_embeddings.content,
        1 - (swiss_law_embeddings.embedding <=> query_embedding) as similarity
        FROM swiss_law_embeddings
        WHERE swiss_law_embeddings.embedding <=> query_embedding < 1 - match_threshold
        ORDER BY swiss_law_embeddings.embedding <=> query_embedding
    LIMIT match_count
$$ LANGUAGE SQL STABLE;
